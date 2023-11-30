import {
    FC,
    useCallback,
    useRef,
    useState,
    useMemo
} from 'react';
import {
    Button, DatePicker, Form, FormInstance, Input, Space, Upload, UploadFile, UploadProps
} from 'antd';
import {
    CheckOutlined, CloseOutlined, UploadOutlined
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import {
    RcFile, UploadChangeParam
} from 'antd/lib/upload';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import {
    IInputsData,
    IResponsePayload,
    TOrderProcessStepsStatus,
} from '@/types/common';
import {
    SingleOrderProcessActions, useSingleOrderProcessData
} from '@/store/singlOrderProcess';

import styles from './OrderProcessCard.module.scss';


type TButtons = 'done' | 'blocked';

interface ICardFormProps {
    stepId?: string;
    id?: string;
    step: number;
    inputsData?: IInputsData;
    status?: TOrderProcessStepsStatus;
}

const CardForm: FC<ICardFormProps> = ({ step }) => {
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
    console.log(state.data);

    const clickHandler = (
        type: TButtons,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (!showTextArea && !buttonType.current) {
            e.preventDefault();
            setShowTextArea(true);
        }
        buttonType.current = type;
    };

    const onFinish = useCallback(async (value: { comment: string }) => {
        console.log('onFinish');
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

    const commentValue = processStep.comment;
    const status = processStep.status;
    const inputsData = processStep.inputsData;
    const isCommentDisabled =
        [ 'pending', 'done' ].includes(status) && Boolean(commentValue);

    const initialInputsDataValue = useMemo(() => {
        const result: any = {};

        Object.keys(inputsData).forEach((key) => {
            const field = inputsData[key as keyof IInputsData];
            if (field.type !== 'file') {
                result[key] = field.type === 'date' ? dayjs(field.value) : field.value;
            }
        });

        console.log(result, 111);
        return result;
    }, [ inputsData ]);

    console.log(inputsData, 666);
    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        console.log(reader, 2233);
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const uploadChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        console.log('uploadChange', info);
        if (info.file.status === 'uploading') {
            // setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            // getBase64(info.file.originFileObj as RcFile, (url) => {
            //     console.log('uploadChange: getBase64', url);
            //     // setLoading(false);
            //     // setImageUrl(url);
            // });
        }
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
                                        disabled={ status === 'pending' }
                                        style={{ width: '228px' }}
                                        // defaultValue={ dayjs() }
                                    />
                                </Space>
                            ) : <Input disabled={ status === 'pending' } /> }
                        </Form.Item>
                    ) : (
                        <Upload
                            disabled={ status === 'pending' }
                            rootClassName={ styles['card-upload-input'] }
                            key={ key }
                            accept={ `.${field.fileType}` }
                            customRequest={ (options) => {
                                console.log('customRequest', options);
                                getBase64(options.file as RcFile, (url) => {
                                    console.log({
                                        name: options.filename,
                                        orderProcessId: processStep.id
                                    });
                                    axios.put('/document/order-process/save', {
                                        imageBase64: url,
                                        name: options.filename,
                                        orderProcessId: orderProcessId
                                    }).then((d) => {
                                        console.log(d, 888888888888);
                                        if (d.status === 200) {
                                            options.onSuccess?.('Ok');
                                        } else {
                                            options.onError?.(new Error('xz'));
                                        }
                                    }).catch((err) => {
                                        console.log('Error', err, 888888888888);
                                        options.onError?.(err);
                                    });
                                });
                            } }
                            multiple={ false }
                            name={ key }
                            listType="picture"
                            onChange={ uploadChange }
                            onDownload={ (file) => {
                                console.log('onDownload', file);
                            } }
                            // defaultFileList={ [] }
                            // fileList={ [] }
                            // showUploadList={ false }
                        >
                            <Button
                                style={{ width: '228px' }}
                                disabled={ status === 'pending' }
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
                        onClick={ clickHandler.bind(null, 'done') }
                    >
                        Done
                    </Button>
                ) }
                { status === 'inProcess' && (
                    <Button
                        danger
                        htmlType="submit"
                        icon={ <CloseOutlined /> }
                        onClick={ clickHandler.bind(null, 'blocked') }
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
