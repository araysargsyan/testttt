'use client';
import {
    FC, memo, useState
} from 'react';
import {
    Button, Modal, Form, Input, Select, UploadProps, UploadFile, DatePicker, Upload
} from 'antd';
import {
    PlusOutlined, UploadOutlined
} from '@ant-design/icons';
import {
    RcFile, UploadChangeParam
} from 'antd/lib/upload';
import dayjs from 'dayjs';

import { useUpdateSession } from '@/store/updateSession';
import axios from '@/lib/axios';
import { EAuthCookie } from '@/types/common';
import getBase64 from '@/lib/util/getBase64';
import {
    SingleOrderProcessActions, useSingleOrderProcessData
} from '@/store/singlOrderProcess';

import styles from './AddInput.module.scss';


type TInputTypes = 'string' | 'file' | 'date';

const AddInput: FC<{id: string}> = ({ id }) => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ inputType, setInputType ] = useState<TInputTypes | null>(null);
    const [ fileList, setFileList ] = useState<UploadFile>({} as never);
    const { current: updateSession } = useUpdateSession();
    const { dispatch } = useSingleOrderProcessData();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleSave = (values: {
        key: string;
        value: string;
    }) => {
        const body = {
            inputsData: {
                [values.key]: {
                    type: inputType,
                    value: inputType === 'file'
                        ? fileList.thumbUrl
                        : inputType === 'date'
                            ? dayjs(values.value).toString() :
                            values.value
                }
            }
        };

        axios.patch(`/order-process/${id}`, body).then(({
            data, newAccessToken
        }) => {
            if (newAccessToken) {
                updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            }

            setIsModalOpen(false);
            dispatch(SingleOrderProcessActions.UPDATE, data);
        });
    };

    const onUploadChange = (info: UploadChangeParam<UploadFile>): void => {
        setFileList(info.fileList[0] || {});
    };
    const onUpload: UploadProps['customRequest'] = (options) => {
        options.onProgress?.({ percent: 0 });
        getBase64(options.file as RcFile, (url) => {
            axios.put('/document/order-process/save', {
                imageBase64: url,
                name: options.filename,
                orderProcessId: id
            }).then(({
                status, newAccessToken
            }) => {
                if (newAccessToken) {
                    updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
                }
                // console.log(`UPDATE_DOCUMENT[name=${options.filename}]: STATUS`, status);
                if (status === 200) {
                    options.onSuccess?.('Ok');
                } else {
                    options.onError?.(new Error('Error'));
                }
            }).catch((err) => {
                console.log(`UPDATE_DOCUMENT[name=${options.filename}]: ERROR`, err);
                options.onError?.(err);
            });
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div style={{
                display: 'flex', justifyContent: 'end'
            }}
            >
                <Button
                    style={{ height: '32px' }}
                    type="primary"
                    icon={ <PlusOutlined /> }
                    onClick={ showModal }
                >
                    Add Input
                </Button>
            </div>
            <Modal
                width={ '420px' }
                title="Add Input"
                open={ isModalOpen }
                onCancel={ handleCancel }
                footer={ null }
            >
                <Select
                    size={ 'middle' }
                    placeholder="Please select input type"
                    onChange={ (v) => setInputType(v) }
                    style={{
                        width: '100%',
                        marginBottom: '20px',
                        marginTop: '20px'
                    }}
                    options={ [
                        {
                            value: 'string',
                            label: 'string'
                        },
                        {
                            value: 'file',
                            label: 'file'
                        },
                        {
                            value: 'date',
                            label: 'date'
                        }
                    ] }
                />
                { inputType ? (
                    <Form
                        layout="vertical"
                        onFinish={ handleSave }
                    >
                        <Form.Item
                            label="Input title"
                            name="key"
                            rules={ [ {
                                required: true, message: 'Please enter a Input title!'
                            } ] }
                        >
                            <Input />
                        </Form.Item>
                        { inputType === 'string' ? (
                            <Form.Item
                                label={ 'Input value' }
                                name="value"
                                rules={ [ {
                                    required: true, message: 'Please enter a Input value!'
                                } ] }
                            >
                                <Input />
                            </Form.Item>
                        ) : inputType === 'file' ? (
                            <Upload
                                fileList={ fileList ? [ fileList ] : [] }
                                rootClassName={ styles['upload-input'] }
                                accept={ '.*' }
                                customRequest={ onUpload }
                                maxCount={ 1 }
                                multiple={ false }
                                listType="picture"
                                onChange={ onUploadChange }
                            >
                                <Button
                                    style={{ width: '100%' }}
                                    icon={ <UploadOutlined /> }
                                >
                                    { fileList.name || 'Upload' }
                                </Button>
                            </Upload>
                        ) : inputType === 'date' ? (
                            <Form.Item
                                name={ 'value' }
                                rules={ [ () => ({
                                    required: true, message: 'This field is required!'
                                }) ] }
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        ) : null }
                        <Form.Item style={{
                            textAlign: 'end', marginBottom: 0
                        }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                ) : null }
            </Modal>
        </>
    );
};

export default memo(AddInput);
