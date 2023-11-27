'use client';

import React, {
    type FC, memo, useMemo
} from 'react';
import { Button } from 'antd';
import { type ColumnsType, ColumnType } from 'antd/lib/table/interface';
import {
    Table as TableComponent,
    type TableProps,
    type PaginationProps,
} from 'antd/lib';
import { usePathname, useRouter } from 'next/navigation';

import upperCaseFirstLetter from '@/lib/util/upperCaseFirstLetter';
import {
    TProviders, useProviderData, useProviderDispatch
} from '@/store';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import getSearchParams from '@/lib/getSearchParams';

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
    const router = useRouter();
    const pathname = usePathname();
    // const searchParams = useSearchParams();
    // console.log(searchParams.toString(), 666);
    const { result: tableData, count } = useProviderData(data, provider);
    const { dispatch, actions } = useProviderDispatch(provider);
    // const tableData = result.map((d) => ({ ...d, key: d.id }));
    // const [ selectedRowKeys, setSelectedRowKeys ] = useState<React.Key[]>([]);
    const { push } = useRouter();
    const axios = useAxiosAuth();

    const orderChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('orderChange', {
            pagination, filters, sorter, extra
        });
        if (!Array.isArray(sorter) && extra.action === 'sort') {
            const params: {limit: string; orderBy?: string; orderDirection?: 'ASC' | 'DESC'} = {
                limit: String(pagination.pageSize),
                orderBy: sorter.field as string,
            };

            if (sorter) {
                if (sorter.order) {
                    params.orderDirection = sorter.order === 'ascend' ? 'ASC' : 'DESC';
                } else {
                    params.orderBy = '';
                    const urlParams = getSearchParams({ ...searchParams, ...params });
                    router.push(`${pathname}?${urlParams.toString()}`);
                }
            }

            axios.get(dataUrl, { params }).then(({ data }) => {
                dispatch(actions.UPDATE, { data });
                const urlParams = getSearchParams({ ...searchParams, ...params });
                router.push(`${pathname}?${urlParams.toString()}`);
            });
        }
    };

    //? const rowSelection: TableRowSelection<DataType> = {
    //     selectedRowKeys,
    //     onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    //         console.log('Selected rows:', selectedRows);
    //         setSelectedRowKeys(newSelectedRowKeys);
    //     },
    //? };

    const handleRowClick = (record: DataType) => {
        console.log('Row clicked:', record);
        push(`${dataUrl}/${record.id}`);
    };

    const columnsWithActions: ColumnsType<DataType> = [
        ...columns.map((key) => {
            const column: ColumnType<DataType> = {
                title: upperCaseFirstLetter(key),
                dataIndex: key,
                key: key,
                sorter: true,
            };

            if (searchParams.orderDirection && searchParams.orderBy === key) {
                column.sortOrder = searchParams.orderDirection === 'ASC' ? 'ascend' : 'descend';
            }

            return column;
        }),
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: () => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        type="primary"
                        danger
                        // onClick={() => handleDelete(record)}
                    >
                        Delete
                    </Button>
                    { !isRowClickable ? (
                        <Button
                            danger
                            // onClick={() => handleEdit(record)}
                        >
                            Edit
                        </Button>
                    ) : '' }
                </div>
            ),
        },
    ];
    const onPaginationChange: PaginationProps['onChange'] = (page, pageSize) => {
        const params = {
            offset: String((page - 1) * pageSize),
            limit: String(pageSize)
        };

        // console.log({
        //     page, pageSize, searchParams
        // }, 'onChange');

        axios.get(dataUrl, { params }).then(({ data }) => {
            dispatch(actions.UPDATE, { data });

            const urlParams = getSearchParams({ ...searchParams, ...params });
            router.push(`${pathname}?${urlParams.toString()}`);
        });
    };

    const paginationOptions = useMemo(() => ({
        total: count,
        current: (Number(searchParams.offset || 0) / Number(searchParams.limit || TableRowLimit)) + 1,
        defaultCurrent: 1,
        pageSize: Number(searchParams.limit || TableRowLimit),
        defaultPageSize: Number(TableRowLimit)
    }), [ count, searchParams.limit, searchParams.offset ]);

    // console.log({
    //     paginationOptions, columnsWithActions, searchParams
    // });
    return (
        <>
            <TableComponent
                // sortDirections={ [ 'descend', 'ascend' ] }
                rowKey={ 'id' }
                // rowSelection={ rowSelection }
                rowClassName={ isRowClickable ? styles['table-row'] : '' }
                pagination={{
                    // pageSizeOptions: [ '10', '20', '30' ],
                    // onShowSizeChange,
                    onChange: onPaginationChange,
                    showSizeChanger: true,
                    ...paginationOptions
                }}
                onChange={ orderChange }
                columns={ columnsWithActions }
                dataSource={ tableData }
                onRow={ (rowData: any) => ({ ...isRowClickable && { onClick: () => handleRowClick(rowData), }, }) }
            />
        </>
    );
};

export default memo(Table);
