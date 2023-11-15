"use client"

import React, {type FC, useState} from 'react';
import {Button} from 'antd';
import {type TableRowSelection} from 'antd/es/table/interface';
import {useRouter} from "next/navigation";
import {Table as TableComponent} from 'antd/lib';
import styles from './Table.module.scss';
import upperCaseFirstLetter from "@/lib/util/upperCaseFirstLetter";


interface DataType {
    key: number;
    name: string;
    age: number;
    address: string;
    description: string;
}

export const Table: FC<{
    data: any;
    dataUrl: string;
    columns: any[];
    isRowClickable: boolean;
}> = ({
    data,
    dataUrl,
    columns,
    isRowClickable
}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState<DataType | null>(null);
    const {push} = useRouter()
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const bordered = false;
    const loading = false;
    const size = 'middle';
    const showTitle = false;
    const showHeader = true;
    const hasData = true;
    const top = 'none';
    const bottom = 'bottomRight';


    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleEdit = (record: DataType) => {
        setEditRecord(record);
        setIsModalVisible(true);
    };

    const handleDelete = (record: DataType) => {
        console.log('Delete:', record);

    };


    const onFinish = (values: any) => {
        const updatedData = data.map((item: DataType) => {
            if (item.key === editRecord?.key) {
                return {...item, ...values};
            }
            return item;
        });

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                <div style={{display: 'flex', gap: '10px'}}>
                    <Button
                        type="primary"
                        danger
                        onClick={() => handleDelete(record)}
                    >
                        Delete
                    </Button>
                    {!isRowClickable ?
                        <Button
                            danger
                            onClick={() => handleEdit(record)}
                        >
                            Edit
                        </Button> : ''}
                </div>
            ),
        },
    ];

    return <TableComponent
        rowKey={'id'}
        rowClassName={styles['table-row']}
        rowSelection={rowSelection}
        pagination={{position: [top, bottom]}}
        columns={columnsWithActions}
        dataSource={hasData ? data : []}
        onRow={(data: any, index) => ({
            ...isRowClickable && {
                onClick: (e) => {
                    push(`${dataUrl}/${data.id}`)
                },
            }
        })}
    />
};
