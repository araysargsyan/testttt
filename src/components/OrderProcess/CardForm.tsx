import {
    type FC,
    type MouseEvent,
    useCallback,
    useRef,
    useState,
    useMemo, useEffect
} from 'react';
import {
    type FormInstance, type UploadFile, type UploadProps,
    Button, DatePicker, Form, Input, Space, Upload,
} from 'antd';
import {
    CheckOutlined, CloseOutlined, UploadOutlined
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import {
    type RcFile,
    type UploadChangeParam
} from 'antd/lib/upload';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import {
    type IInputsData,
    type IOrderProcessDocuments,
    type IResponsePayload,
} from '@/types/common';
import {
    SingleOrderProcessActions, useSingleOrderProcessData
} from '@/store/singlOrderProcess';
import getBase64 from '@/lib/util/getBase64';

import styles from './OrderProcessCard.module.scss';


type TButtons = 'done' | 'blocked';

interface ICardFormProps {
    uploadedDocuments: Record<string, IOrderProcessDocuments>;
    step: number;
}

const CardForm: FC<ICardFormProps> = ({
    step, uploadedDocuments
}) => {
    const axios = useAxiosAuth();
    const [ showTextArea, setShowTextArea ] = useState<boolean>(false);
    const formRef = useRef<FormInstance | null>(null);
    const buttonType = useRef<TButtons | null>(null);
    const textAreaPlaceholder = `${
        buttonType.current === 'blocked' ||
        formRef.current?.getFieldError('comment').length
            ? '*'
            : ''
    }Leave a comment...`;
    const {
        dispatch, state
    } = useSingleOrderProcessData();
    const processStep = state.data!.processSteps[step];
    const orderProcessId = state.data!.id;
    const commentValue = processStep.comment;
    const status = processStep.status;
    const inputsData = processStep.inputsData;
    const isCommentDisabled = [ 'pending', 'done' ].includes(status) && Boolean(commentValue);
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
            if (uploadedDocuments[key]) {
                defaultFileList[key] = {
                    uid: uploadedDocuments[key].id,
                    name: uploadedDocuments[key].name,
                    type: uploadedDocuments[key].contentType,
                    status: 'uploading',
                    percent: 0,
                };
            }
        });

        return defaultFileList;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [ fileList, setFileList ] = useState<Record<string, UploadFile>>(getDefaultFileList);

    useEffect(() => {
        Object.keys(inputsData).forEach((key) => {
            if (uploadedDocuments[key]) {
                axios.get<string>(`/document/image/${uploadedDocuments[key].id}`)
                    .then((res) => {
                        console.log(`GET_DOCUMENT[id=${uploadedDocuments[key].id}]: STATUS`, res.status);
                        setFileList((prevState) => ({
                            ...prevState,
                            [key]: {
                                ...prevState[key],
                                url: res.data,
                                status: 'done',
                                percent: 100
                            }
                        }));
                    })
                    .catch((e) => {
                        console.log(`GET_DOCUMENT[id=${uploadedDocuments[key].id}]: ERROR`, e);
                        setFileList((prevState) => ({
                            ...prevState,
                            [key]: {
                                ...prevState[key],
                                status: 'error',
                                percent: 100
                            }
                        }));
                    });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onStepSubmit = (type: TButtons, e: MouseEvent<HTMLButtonElement>) => {
        if (!showTextArea && !buttonType.current) {
            e.preventDefault();
            setShowTextArea(true);
        }
        buttonType.current = type;
    };

    const onFinish = useCallback(async (value: { comment: string }) => {
        const {
            comment, ...inputsData
        } = value;
        const body: Record<string, any> = {
            status: buttonType.current,
            comment,
        };

        if (inputsData) {
            body.inputsData = inputsData;

            Object.keys(inputsData).forEach((k) => {
                if (processStep.inputsData[k].type === 'date') {
                    body.inputsData[k] = {
                        value: body.inputsData[k].toISOString(),
                        type: 'date',
                    };
                } else {
                    body.inputsData[k] = {
                        value: body.inputsData[k],
                        type: processStep.inputsData[k].type,
                    };
                }
            });
        }

        try {
            await axios.patch<IResponsePayload<any>>(
                `/process-step/${state.data?.processSteps[step].id}`,
                body
            );

            const res = await axios.get(`/order-process/${state.data?.id}`);
            dispatch(SingleOrderProcessActions.UPDATE, res.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            buttonType.current = null;
            setShowTextArea(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                orderProcessId: orderProcessId
            }).then((res) => {
                console.log(`UPDATE_DOCUMENT[name=${options.filename}]: STATUS`, res.status);
                if (res.status === 200) {
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

    return (
        <Form
            layout="vertical"
            className={ styles['card-form'] }
            name={ `order_process_step_${step}` }
            ref={ formRef }
            onFinish={ onFinish }
            initialValues={{
                ...initialInputsDataValue, comment: commentValue
            }}
        >
            { Object.keys(inputsData).map((key) => {
                const field = inputsData[key as keyof IInputsData];

                return (
                    field.type !== 'file' ? (
                        <Form.Item
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
                                        disabled={ [ 'pending', 'done' ].includes(status) }
                                        style={{ width: '228px' }}
                                        defaultValue={ initialInputsDataValue[key] }
                                    />
                                </Space>
                            ) : <Input disabled={ [ 'pending', 'done' ].includes(status) } /> }
                        </Form.Item>
                    ) : (
                        <Upload
                            fileList={ fileList[key] ? [ fileList[key] ] : [] }
                            disabled={ [ 'pending', 'done' ].includes(status) }
                            rootClassName={ styles['card-upload-input'] }
                            key={ key }
                            accept={ `.${field.fileType}` }
                            customRequest={ onUpload }
                            maxCount={ 1 }
                            multiple={ false }
                            name={ key }
                            listType="picture"
                            onChange={ onUploadChange.bind(null, key) }
                        >
                            <Button
                                style={{ width: '228px' }}
                                disabled={ [ 'pending', 'done' ].includes(status) }
                                icon={ <UploadOutlined /> }
                            >
                                { key }
                            </Button>
                        </Upload>
                    )
                );
            }) }
            <div className={ styles['card-buttons'] }>
                { ![ 'pending', 'done' ].includes(status) && (
                    <Button
                        htmlType="submit"
                        className={ styles['button-confirm'] }
                        icon={ <CheckOutlined /> }
                        onClick={ onStepSubmit.bind(null, 'done') }
                    >
                        Done
                    </Button>
                ) }
                { status === 'inProcess' && (
                    <Button
                        danger
                        htmlType="submit"
                        icon={ <CloseOutlined /> }
                        onClick={ onStepSubmit.bind(null, 'blocked') }
                    >
                        Problem
                    </Button>
                ) }
            </div>
            { (showTextArea || isCommentDisabled) && (
                <Form.Item
                    label={ isCommentDisabled ? 'Comment' : '' }
                    className={ styles['card-comment-field'] }
                    name="comment"
                    rules={ [ () => ({
                        required: buttonType.current === 'blocked', message: 'Please leave a comment!'
                    }) ] }
                >
                    <TextArea
                        disabled={ isCommentDisabled }
                        className={ isCommentDisabled ? '' : styles['card-comment'] }
                        placeholder={ textAreaPlaceholder }
                        rows={ 4 }
                    />
                </Form.Item>
            ) }
        </Form>
    );
};

export default CardForm;
