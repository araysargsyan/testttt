import {
    type FC,
    type MouseEvent,
    useCallback,
    useRef,
    useState,
    memo
} from 'react';
import {
    type FormInstance,
    Button,
    Form
} from 'antd';
import {
    CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

import {
    EAuthCookie,
    type IResponsePayload,
} from '@/types/common';
import {
    SingleOrderProcessActions, useSingleOrderProcessData
} from '@/store/singlOrderProcess';
import axios from '@/lib/axios';
import { useUpdateSession } from '@/store/updateSession';

import styles from './OrderProcessCard.module.scss';


type TButtons = 'done' | 'blocked';

interface ICardFormProps {
    step: number;
}

const CardForm: FC<ICardFormProps> = ({ step }) => {
    const { current: updateSession } = useUpdateSession();
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
    const commentValue = processStep.comment;
    const status = processStep.status;
    const isCommentDisabled = [ 'pending', 'done' ].includes(status) && Boolean(commentValue);

    const onStepSubmit = (type: TButtons, e: MouseEvent<HTMLButtonElement>) => {
        if (!showTextArea && !buttonType.current) {
            e.preventDefault();
            setShowTextArea(true);
        }
        buttonType.current = type;
    };

    const onFinish = useCallback(async (value: { comment: string }) => {
        const { comment, } = value;
        const body: Record<string, any> = {
            status: buttonType.current,
            comment,
        };

        try {
            await axios.patch<IResponsePayload<any>>(
                `/process-step/${state.data?.processSteps[step].id}`,
                body
            ).then(({ newAccessToken }) => {
                if (newAccessToken) {
                    updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
                }
            });

            const {
                data, newAccessToken
            } = await axios.get(`/order-process/${state.data?.id}`);

            if (newAccessToken) {
                updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            }
            dispatch(SingleOrderProcessActions.UPDATE, data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            buttonType.current = null;
            setShowTextArea(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form
            layout="vertical"
            className={ styles['card-form'] }
            name={ `order_process_step_${step}` }
            ref={ formRef }
            onFinish={ onFinish }
            initialValues={{ comment: commentValue }}
        >
            <div className={ styles['card-buttons'] }>
                {
                    <Button
                        htmlType="submit"
                        className={ styles['button-confirm'] }
                        icon={ <CheckOutlined /> }
                        onClick={ onStepSubmit.bind(null, 'done') }
                    >
                        Done
                    </Button>
                }
                <Button
                    danger
                    htmlType="submit"
                    icon={ <CloseOutlined /> }
                    onClick={ onStepSubmit.bind(null, 'blocked') }
                >
                    Problem
                </Button>
            </div>
            { (showTextArea || isCommentDisabled) && (
                <Form.Item
                    style={{ marginTop: '20px' }}
                    label={ 'Comment' }
                    className={ styles['card-comment-field'] }
                    name="comment"
                    rules={ [ () => ({
                        required: buttonType.current === 'blocked', message: 'Please leave a comment!'
                    }) ] }
                >
                    <TextArea
                        // disabled={ isCommentDisabled }
                        className={ isCommentDisabled ? '' : styles['card-comment'] }
                        placeholder={ textAreaPlaceholder }
                        rows={ 4 }
                    />
                </Form.Item>
            ) }
        </Form>
    );
};

export default memo(CardForm);
