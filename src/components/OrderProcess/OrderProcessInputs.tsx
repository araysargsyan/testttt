import {
    FC, memo, useMemo, useState
} from 'react';
import dayjs from 'dayjs';
import {
    Button, DatePicker, Form, Input, Space, Upload, UploadFile, UploadProps
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
    RcFile, UploadChangeParam
} from 'antd/lib/upload';

import {
    SingleOrderProcessActions, useSingleOrderProcessData
} from '@/store/singlOrderProcess';
import {
    EAuthCookie, IInputsData,
} from '@/types/common';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import getBase64 from '@/lib/util/getBase64';
import axios from '@/lib/axios';
import { useUpdateSession } from '@/store/updateSession';

import styles from './OrderProcessCard.module.scss';


const OrderProcessInputs: FC = () => {
    const {
        dispatch, state
    } = useSingleOrderProcessData();
    const { current: updateSession } = useUpdateSession();
    const inputsData = state.data.inputsData;
    const orderProcessId = state.data.id;
    // const uploadedDocuments = useMemo(() => {
    //     const docs: Record<string, IOrderProcessDocuments> = {};
    //     console.log(state.data.documents, 66);
    //     state.data.documents.forEach((document) => {
    //         docs[document.name] = document;
    //     });
    //
    //     return docs;
    // }, [ state.data.documents ]);
    // console.log(uploadedDocuments, 666);
    const initialInputsDataValue = useMemo(() => {
        const result: Record<string, any> = {};

        Object.keys(inputsData).forEach((key) => {
            const field = inputsData[key as keyof IInputsData];
            if (field.type !== 'file') {
                result[key] = field.type === 'date' ? dayjs(field.value) : field.value;
            }
        });
        return result;
    }, [ inputsData ]);
    const getDefaultFileList = useMemo(() => {
        const defaultFileList: Record<string, UploadFile> = {};

        Object.keys(inputsData).forEach((key) => {
            if (inputsData[key].type === 'file' && inputsData[key].value) {
                defaultFileList[key] = {
                    uid: key,
                    name: key,
                    thumbUrl: inputsData[key].value,
                    status: 'done',
                    percent: 100
                };
            }
        });

        return defaultFileList;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [ fileList, setFileList ] = useState<Record<string, UploadFile>>(getDefaultFileList);
    const [ isLoading, setIsLoading ] = useState(false);

    // useEffect(() => {
    //     Object.keys(inputsData).forEach((key) => {
    //         if (uploadedDocuments[key]) {
    //             axios.get<string>(`/document/image/${uploadedDocuments[key].id}`)
    //                 .then(({
    //                     data, newAccessToken
    //                 }) => {
    //                     console.log(data, 333);
    //                     if (newAccessToken) {
    //                         updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
    //                     }
    //                     // console.log(`GET_DOCUMENT[id=${uploadedDocuments[key].id}]: STATUS`, status);
    //                     setFileList((prevState) => ({
    //                         ...prevState,
    //                         [key]: {
    //                             ...prevState[key],
    //                             url: data,
    //                             status: 'done',
    //                             percent: 100
    //                         }
    //                     }));
    //                 })
    //                 .catch((e) => {
    //                     console.log(`GET_DOCUMENT[id=${uploadedDocuments[key].id}]: ERROR`, e);
    //                     setFileList((prevState) => ({
    //                         ...prevState,
    //                         [key]: {
    //                             ...prevState[key],
    //                             status: 'error',
    //                             percent: 100
    //                         }
    //                     }));
    //                 });
    //         }
    //     });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const onUploadChange = (key: string, info: UploadChangeParam<UploadFile>): void => {
        setFileList((prevState) => ({
            ...prevState,
            [key]: info.fileList[0]
        }));
    };

    const onUpload: UploadProps['customRequest'] = (options) => {
        options.onProgress?.({ percent: 0 });
        getBase64(options.file as RcFile, (url) => {
            axios.put('/document/order-process/save', {
                imageBase64: url,
                name: options.filename,
                orderProcessId
            }).then(({
                status, newAccessToken
            }) => {
                if (newAccessToken) {
                    updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
                }
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
    const handleSave = (values: Record<string, string>) => {
        const body = { inputsData: {} as Record<string, {type: string; value?: string}> };
        setIsLoading(true);
        Object.keys(values).forEach((key) => {
            const inputType = inputsData[key].type;

            body.inputsData[key] = {
                type: inputType,
                value: inputType === 'date'
                    ? dayjs(values[key]).toString()
                    : values[key]
            };
        });

        Object.keys(fileList).forEach((key) => {
            const inputType = inputsData[key].type;

            body.inputsData[key] = {
                type: inputType,
                value: fileList[key]?.thumbUrl
            };
        });

        axios.patch(`/order-process/${orderProcessId}`, body).then(({
            data, newAccessToken
        }) => {
            if (newAccessToken) {
                updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            }

            dispatch(SingleOrderProcessActions.UPDATE, data);
        }).finally(() => setIsLoading(false));
    };

    return (
        <>
            <h3 style={{ marginBottom: '20px' }}>Inputs Data</h3>
            <Form
                layout="vertical"
                onFinish={ handleSave }
            >
                { Object.keys(inputsData).map((key) => {
                    const field = inputsData[key as keyof IInputsData];

                    return (
                        field.type !== 'file' ? (
                            <Form.Item
                                initialValue={ inputsData[key].value }
                                style={{ width: '228px' }}
                                label={ camelCaseToSpaces(key) }
                                key={ key }
                                name={ key }
                                rules={ [ () => ({
                                    required: true, message: 'This field is required!'
                                }) ] }
                            >
                                { field.type === 'date' ? (
                                    <Space
                                        direction="vertical"
                                        size={ 12 }
                                    >
                                        <DatePicker
                                            style={{ width: '228px' }}
                                            defaultValue={ initialInputsDataValue[key] }
                                        />
                                    </Space>
                                ) : <Input /> }
                            </Form.Item>
                        ) : (
                            <Upload
                                fileList={ fileList[key] ? [ fileList[key] ] : [] }
                                rootClassName={ styles['card-upload-input'] }
                                key={ key }
                                accept={ `.${field.fileType || '*'}` }
                                customRequest={ onUpload }
                                maxCount={ 1 }
                                multiple={ false }
                                name={ key }
                                listType="picture"
                                onChange={ onUploadChange.bind(null, key) }
                            >
                                <Button
                                    style={{ width: '228px' }}
                                    icon={ <UploadOutlined /> }
                                >
                                    { key }
                                </Button>
                            </Upload>
                        )
                    );
                }) }
                <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={ isLoading }
                    >
                        Save changes
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default memo(OrderProcessInputs);
