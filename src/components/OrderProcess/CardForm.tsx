import {MouseEvent, FC, useCallback, useRef, useState} from 'react';
import {Button, DatePicker, Form, FormInstance, Input} from 'antd';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import styles from './OrderProcessCard.module.scss';
import useAxiosAuth from "@/hooks/useAxiosAuth";
import TextArea from "antd/lib/input/TextArea";
import camelCaseToSpaces from "@/lib/util/camelCaseToSpace";
import {IInputsData, IResponsePayload, TOrderProcessStepsStatus} from "@/types/common";
import {orderProcessActions, useOrderProcessData} from "@/store/orderProcess";
import moment from "moment";
import { useMemo } from 'react';


type TButtons = 'done' | 'blocked'

interface ICardFormProps {
    stepId?: string;
    id?: string;
    step: number;
    inputsData?: IInputsData;
    status?: TOrderProcessStepsStatus
}

const CardForm: FC<ICardFormProps> = ({
    step,
    // inputsData,
    // status,
    // stepId,
    // id
}) => {
    const axios = useAxiosAuth()
    const [showTextArea, setShowTextArea] = useState<boolean>(false);
    const formRef = useRef<FormInstance | null>(null);
    const buttonType = useRef<TButtons | null>(null)
    const textAreaPlaceholder = `${(
        buttonType.current === 'blocked'
        || formRef.current?.getFieldError('comment').length
    ) ? '*' : ''}Leave a comment...`
    const {dispatch, state} = useOrderProcessData()


    const clickHandler = (type: TButtons, e: MouseEvent<HTMLButtonElement>) => {
        // console.log('clickHandler', {type, willShow: !showTextArea && !buttonType.current})

        if (!showTextArea && !buttonType.current) {
            e.preventDefault()
            setShowTextArea(true)
        }

        buttonType.current = type
    }

    const onFinish = useCallback(async (value: { comment: string }) => {
        // console.log('onCommentDone', {value, showTextArea, formRef, a: formRef.current?.getFieldValue('comment')})
        const {comment, ...inputsData} = value
        const body: Record<string, any> = {
            status: buttonType.current,
            comment: value.comment,
        }
        if (inputsData) {
            body.inputsData = inputsData
            Object.keys(inputsData).forEach((k) => {
                if (state.data!.processSteps[step].inputsData[k].type === 'date') {
                    body.inputsData[k] = {
                        value: body.inputsData[k].toISOString(),
                        type: 'date'
                    }
                } else {
                    body.inputsData[k] = {
                        value: body.inputsData[k],
                        type: state.data!.processSteps[step].inputsData[k].type
                    }
                }
            })
        }

        axios.patch<IResponsePayload<any>>(`/process-step/${state.data?.processSteps[step].id}`, body)
            .then((d) => {
                axios.get(`/order-process/${state.data?.id}`)
                    .then((d) => {
                        console.log('DATA', d.data, 66666666)
                        dispatch(orderProcessActions.UPDATE, d.data)
                    }).catch((e) => {
                    console.log('ERROR', e, 66666666)
                })
            }).finally(() => {
                buttonType.current = null;
                setShowTextArea(false)
            })
    }, [])

    const commentValue = state.data!.processSteps[step].comment
    const status = state.data!.processSteps[step].status
    const inputsData = state.data!.processSteps[step].inputsData
    const isCommentDisabled = ['pending', 'done'].includes(status) && Boolean(commentValue)

    const initialInputsDataValue = useMemo(() => {
        const result: any = {};

        Object.keys(inputsData).forEach((key) => {
            const field = inputsData[key as keyof IInputsData];
            result[key] = field.type === 'date' ? moment(field.value) : field.value;
        });

        return result;
    }, [state, step]);


    return (
        <Form
            layout="vertical"
            className={styles['card-form']}
            name={`order_process_step_${step}`}
            ref={formRef}
            onFinish={onFinish}
            initialValues={{...initialInputsDataValue, comment: commentValue}}
        >
            {Object.keys(inputsData).map((key) => {
                const field = inputsData[key as keyof IInputsData]

                return (
                    <Form.Item
                        style={{width: "228px"}}
                        label={camelCaseToSpaces(key)}
                        key={key}
                        name={key}
                        rules={[() => ({
                            required: true,
                            message: 'This field is required!'
                        })]}
                    >
                        {
                            field.type === 'date'
                                ? <DatePicker
                                    style={{width: '100%'}}
                                    disabled={status === 'pending'}
                                />
                                : <Input
                                    disabled={status === 'pending'}
                                />
                        }
                    </Form.Item>
                )
            })}
            <div className={styles['card-buttons']}>
                {!['pending', 'done'].includes(status) && <Button
                    htmlType={'submit'}
                    className={styles['button-confirm']}
                    icon={<CheckOutlined/>}
                    onClick={clickHandler.bind(null, 'done')}
                >
                    Done
                </Button>}
                {status === 'inProcess' && <Button
                    danger
                    htmlType={'submit'}
                    icon={<CloseOutlined/>}
                    onClick={clickHandler.bind(null, 'blocked')}
                >
                    Problem
                </Button>}
            </div>
            {(showTextArea || isCommentDisabled) && (
                <Form.Item
                    label={isCommentDisabled ? 'Comment' : ''}
                    className={styles['card-comment-field']}
                    name="comment"
                    rules={[() => ({
                        required: buttonType.current === 'blocked',
                        message: 'Please leave a comment!'
                    })]}
                >
                    <TextArea
                        disabled={isCommentDisabled}
                        className={isCommentDisabled ? '' : styles['card-comment']}
                        placeholder={textAreaPlaceholder}
                        // onBlur={setShowTextArea.bind(null, false)}
                        rows={4}
                    />
                </Form.Item>
            )}
        </Form>
    );
};

export default CardForm;


// return (
//     <Form
//         layout="vertical"
//         className={styles['card-footer']}
//         name={`order_process_step_${step}`}
//         ref={formRef}
//         onFinish={onFinish}
//         initialValues={worker}
//         // initialValues={}
//     >
//         <Form.Item
//             label={"date"}
//             // labelAlign={}
//             // labelCol={{span: 4}}
//             name={"date"}
//             rules={[() => ({
//                 required: true,
//                 message: 'This field is required!'
//             })]}
//             // initialValue={"2023-11-14T16:18:28.696Z"}
//         >
//             <DatePicker locale={dateFormat} />
//         </Form.Item>
//     </Form>)
