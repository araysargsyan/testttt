import {
    FC,
    useCallback,
    useRef,
    useState,
    useMemo
} from 'react';
import {
    Button, DatePicker, Form, FormInstance, Input, Space
} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import {
    IInputsData,
    IResponsePayload,
    TOrderProcessStepsStatus,
} from '@/types/common';
import { OrderProcessActions, useOrderProcessData } from '@/store/orderProcess';


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
    const { dispatch, state } = useOrderProcessData();
    const processStep = state.data!.processSteps[step];

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

    const onFinish = useCallback(
        async (value: { comment: string }) => {
            const { comment, ...inputsData } = value;
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
                dispatch(OrderProcessActions.UPDATE, res.data);
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
            result[key] =
                field.type === 'date' ? dayjs(field.value) : field.value;
        });

        return result;
    }, [ inputsData ]);

    return (
        <Form
            layout="vertical"
            className={ styles['card-form'] }
            name={ `order_process_step_${step}` }
            ref={ formRef }
            onFinish={ onFinish }
            initialValues={{ ...initialInputsDataValue, comment: commentValue }}
        >
            { Object.keys(inputsData).map((key) => {
                const field = inputsData[key as keyof IInputsData];

                return (
                    <Form.Item
                        style={{ width: '228px' }}
                        label={ camelCaseToSpaces(key) }
                        key={ key }
                        name={ key }
                        rules={ [ () => ({ required: true, message: 'This field is required!' }) ] }
                    >
                        { field.type === 'date' ? (
                            <Space
                                direction="vertical"
                                size={ 12 }
                            >
                                <DatePicker
                                    style={{ width: '228px' }}
                                    defaultValue={ dayjs() }
                                />
                            </Space>
                        ) : (
                            <Input disabled={ status === 'pending' } />
                        ) }
                    </Form.Item>
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
                    rules={ [ () => ({ required: buttonType.current === 'blocked', message: 'Please leave a comment!' }) ] }
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
