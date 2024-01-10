'use client';
import React, {
    FC, memo, useMemo
} from 'react';
import { Button } from 'antd';
import {
    ColumnsType, ColumnType
} from 'antd/lib/table/interface';
import {
    Table as TableComponent, TableProps, PaginationProps
} from 'antd/lib';
import {
    usePathname, useRouter
} from 'next/navigation';
import dayjs from 'dayjs';

import upperCaseFirstLetter from '@/lib/util/upperCaseFirstLetter';
import {
    TProviders, useProviderData, useProviderDispatch
} from '@/store';
import getSearchParams from '@/lib/getSearchParams';
import axios from '@/lib/axios';
import { EAuthCookie } from '@/types/common';
import { useUpdateSession } from '@/store/updateSession';

import styles from './Table.module.scss';
import { TableRowLimit } from './';


type DataType = Record<string, any>;

const Table: FC<{
    searchParams: Record<string, string>;
    data?: any;
    provider?: TProviders;
    dataUrl: string;
    columns: any[];
    isRowClickable: boolean;
}> = ({
    searchParams,
    data,
    provider,
    dataUrl,
    columns,
    isRowClickable,
}) => {
    const pathname = usePathname();
    const {
        result: tableData, count
    } = useProviderData(data, provider);
    const {
        dispatch, actions
    } = useProviderDispatch(provider);
    const { push } = useRouter();
    const { current: updateSession } = useUpdateSession();

    const orderChange: TableProps<DataType>['onChange'] = (
        pagination,
        _,
        sorter,
        extra
    ) => {
        if (!Array.isArray(sorter) && extra.action === 'sort') {
            const urlParams = getSearchParams(searchParams, location.search);
            urlParams.set('limit', String(pagination.pageSize));
            urlParams.set('orderBy', String(sorter.field));

            if (sorter) {
                if (sorter.order) {
                    urlParams.set('orderDirection', sorter.order === 'ascend' ? 'ASC' : 'DESC');
                } else {
                    urlParams.set('orderBy', '');
                }
            }

            // console.log('orderChange', { params: urlParams.toObject() });
            axios.get(dataUrl, { params: urlParams.toObject() }).then(({
                data, newAccessToken
            }) => {
                if (newAccessToken) {
                    updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
                }
                dispatch(actions.UPDATE, { data });
                window.history.pushState({}, '', `${pathname}?${urlParams.toString()}`);
            });
        }
    };

    const handleRowClick = (record: DataType) => {
        push(`${dataUrl}/${record.id}`);
    };

    const columnsWithActions: ColumnsType<DataType> = [
        ...columns.map((key) => {
            const column: ColumnType<DataType> = {
                title: upperCaseFirstLetter(key),
                dataIndex: key,
                key: key,
                sorter: true,
                render: (text, _) => {
                    if ([ 'value' ].includes(key) && typeof text === 'object') {
                        return JSON.stringify(text, null, 2);
                    }

                    if ([ 'createdAt', 'updatedAt', 'deletedAt', 'blockedAt' ].includes(key)) {
                        return dayjs(text).format('YYYY-MM-DD');
                    }
                    return String(text);
                },
            };
            delete column.sortOrder;
            const urlParams = new URLSearchParams(typeof location !== 'undefined' ? location.search : undefined);

            if (urlParams.get('orderDirection') && urlParams.get('orderBy') === key) {
                column.sortOrder = urlParams.get('orderDirection') === 'ASC'
                    ? 'ascend' : 'descend';
            }
            if (typeof location === 'undefined' && searchParams.orderDirection && searchParams.orderBy === key) {
                column.sortOrder = searchParams.orderDirection === 'ASC'
                    ? 'ascend' : 'descend';
            }

            return column;
        }),
    ];

    if (columns.length) {
        columnsWithActions.push({
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: () => (
                <div style={{
                    display: 'flex', gap: '10px'
                }}
                >
                    <Button
                        type="primary"
                        danger
                    >
                        Delete
                    </Button>
                    { !isRowClickable ? <Button danger>Edit</Button> : '' }
                </div>
            ),
        });
    }

    const onPaginationChange: PaginationProps['onChange'] = (page, pageSize) => {
        const urlParams = getSearchParams(searchParams, location.search);
        urlParams.set('offset', String((page - 1) * pageSize));
        urlParams.set('limit', String(pageSize));

        // console.log('onPaginationChange', { params: urlParams.toObject() });
        axios.get(dataUrl, { params: urlParams.toObject() }).then(({
            data, newAccessToken
        }) => {
            if (newAccessToken) {
                updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            }
            dispatch(actions.UPDATE, { data });
            window.history.pushState({}, '', `${pathname}?${urlParams.toString()}`);
        });
    };

    const paginationOptions = useMemo(
        () => {
            const urlParams = new URLSearchParams(typeof location !== 'undefined' ? location.search : undefined);
            const pageSize = Number(
                urlParams.get('limit')
                || (typeof location === 'undefined' && searchParams.limit)
                || TableRowLimit
            );
            const offset = Number(
                urlParams.get('offset')
                || (typeof location === 'undefined' && searchParams.offset)
                || 0
            );

            return {
                total: count,
                current: (offset / pageSize) + 1,
                defaultCurrent: 1,
                pageSize,
                defaultPageSize: Number(TableRowLimit),
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ count, tableData, searchParams ]
    );

    return (
        <>
            <TableComponent
                rowKey={ 'id' }
                rowClassName={ isRowClickable ? styles['table-row'] : '' }
                pagination={{
                    onChange: onPaginationChange,
                    showSizeChanger: true,
                    ...paginationOptions,
                }}
                onChange={ orderChange }
                columns={ columnsWithActions }
                dataSource={ tableData }
                onRow={ (rowData: any) => ({ ...isRowClickable && { onClick: () => handleRowClick(rowData) }, }) }
            />
        </>
    );
};

export default memo(Table);
