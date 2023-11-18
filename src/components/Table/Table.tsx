'use client';

import React, {
    type FC, memo, useState
} from 'react';
import { Button } from 'antd';
import { type TableRowSelection } from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import { Table as TableComponent } from 'antd/lib';

import upperCaseFirstLetter from '@/lib/util/upperCaseFirstLetter';
import { TProviders, useProviderData } from '@/store';

import styles from './Table.module.scss';


interface DataType {
    id: string;
    key: number;
    name: string;
    age: number;
    address: string;
    description: string;
}

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
    const tableData = useProviderData(data, provider);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState<React.Key[]>([]);
    const [ sortedInfo, setSortedInfo ] = useState<{
        columnKey?: string;
        order?: 'ascend' | 'descend';
    }>({});
    const { push } = useRouter();

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        // setSortedInfo({
            // columnKey: sorter.columnKey,
            // order: sorter.order,
        // });

        const columnDataIndex = sorter.columnKey || (sorter.column && sorter.column.dataIndex);

        if (sorter.order === 'ascend') {
            console.log('Sorting Order: Ascending');
        } else if (sorter.order === 'descend') {
            console.log('Sorting Order: Descending');
        } else {
            console.log('Sorting Order: Unsorted');
        }

        console.log('Column Index:', columnDataIndex);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
            console.log('Selected rows:', selectedRows);
        },
    };

    const handleRowClick = (record: DataType) => {
        console.log('Row clicked:', record);
        push(`${dataUrl}/${record.id}`);
    };

    const columnsWithActions: any = [
        ...columns.map((key) => ({
            title: upperCaseFirstLetter(key),
            dataIndex: key,
            key: key,
        })),
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: any, record: DataType) => (
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

    return (
        <>
            <TableComponent
                rowKey={ 'id' }
                rowClassName={ isRowClickable ? styles['table-row'] : '' }
                rowSelection={ rowSelection }
                pagination={{ position: [ 'none', 'bottomRight' ] }}
                columns={ columnsWithActions.map((column: any) => ({
                    ...column,
                    sorter: (a: any, b: any) => {
                        if (column.dataIndex === 'actions') {
                            return 0;
                        }
                        const valueA = a[column.dataIndex];
                        const valueB = b[column.dataIndex];

                        if (typeof valueA === 'string') {
                            return valueA.localeCompare(valueB);
                        } else if (typeof valueA === 'number') {
                            return valueA - valueB;
                        } else {
                            return 0;
                        }
                    },
                    sortOrder: sortedInfo.columnKey === column.dataIndex ? sortedInfo.order : undefined,
                })) }
                dataSource={ tableData }
                onRow={ (rowData: any) => ({ ...isRowClickable && { onClick: () => handleRowClick(rowData), }, }) }
            />
        </>
    );
};

export default memo(Table);
