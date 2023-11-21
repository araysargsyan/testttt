'use client';

import React, { type FC, memo } from 'react';
import { Button } from 'antd';
import { type ColumnsType } from 'antd/lib/table/interface';
import {
    Table as TableComponent,
    type TableProps,
    type PaginationProps,
} from 'antd/lib';
import { useRouter } from 'next/navigation';

import upperCaseFirstLetter from '@/lib/util/upperCaseFirstLetter';
import { TProviders, useProviderData } from '@/store';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { AdminsActions, useAdminsDispatch } from '@/store/admins';

import styles from './Table.module.scss';
import { TableRowLimit } from './';


type DataType = Record<string, any>;

const Table: FC<{
    data?: any;
    provider?: TProviders;
    dataUrl: string;
    columns: any[];
    isRowClickable: boolean;
}> = ({
    data,
    provider,
    dataUrl,
    columns,
    isRowClickable,
}) => {
    const { result: tableData, count } = useProviderData(data, provider);
    // const tableData = result.map((d) => ({ ...d, key: d.id }));
    // const [ selectedRowKeys, setSelectedRowKeys ] = useState<React.Key[]>([]);
    const { push } = useRouter();
    const axios = useAxiosAuth();
    const dispatch = useAdminsDispatch();

    const orderChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('orderChange', {
            pagination, filters, sorter, extra
        });
        if (!Array.isArray(sorter) && extra.action === 'sort') {
            const searchParams: {limit: number; orderBy: string; orderDirection?: 'ASC' | 'DESC'} = {
                limit: pagination.pageSize!,
                orderBy: sorter.field as string,
            };

            if (sorter) {
                searchParams.orderDirection = sorter.order === 'ascend' ? 'ASC' : 'DESC';
            }

            console.log(searchParams);

            axios.get(dataUrl, { params: searchParams }).then(({ data }) => {
                dispatch(AdminsActions.UPDATE, { data });
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
        ...columns.map((key) => ({
            title: upperCaseFirstLetter(key),
            dataIndex: key,
            key: key,
            sorter: true,
        })),
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
        const searchParams = {
            offset: (page - 1) * pageSize,
            limit: pageSize
        };

        // console.log({
        //     page, pageSize, searchParams
        // }, 'onChange');

        axios.get(dataUrl, { params: searchParams }).then(({ data }) => {
            dispatch(AdminsActions.UPDATE, { data });
        });
    };

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
                    total: count,
                    showSizeChanger: true,
                    defaultPageSize: TableRowLimit
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
