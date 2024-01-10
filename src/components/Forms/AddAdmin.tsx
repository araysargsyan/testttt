'use client';
import {
    FC, memo, useState
} from 'react';
import {
    Button, Modal, Form, Input
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import {
    AdminsActions, useAdminsDispatch
} from '@/store/admins';
import { useUpdateSession } from '@/store/updateSession';
import axios from '@/lib/axios';
import { EAuthCookie } from '@/types/common';


const AddAdmin: FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const { current: updateSession } = useUpdateSession();
    const dispatch = useAdminsDispatch();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleSave = (values: any) => {
        axios.get('/role').then(({
            data, newAccessToken
        }) => {
            // console.log('FETCH_ROLE: SUCCESS', data);
            if (newAccessToken) {
                updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            }
            let roleId;
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === 'admin') {
                    roleId = data[i].id;
                    break;
                }
            }

            axios.post('/user', {
                ...values,
                role: { id: roleId }
            }).then(({
                data, newAccessToken
            }) => {
                if (newAccessToken) {
                    updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
                }
                // console.log('CREATE_ADMIN: SUCCESS', data);
                dispatch(AdminsActions.ADD, { data: { result: data } });
            }).catch((e) => {
                console.log('CREATE_ADMIN: ERROR', e);
            });
        }).catch((e) => {
            console.log('FETCH_ROLE: ERROR', e);
        }).finally(() => {
            setIsModalOpen(false);
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Define the form layout
    const layout = { labelCol: { span: 6 }, };

    return (
        <>
            <div style={{
                display: 'flex', justifyContent: 'end'
            }}
            >
                <Button
                    type="primary"
                    icon={ <PlusOutlined /> }
                    onClick={ showModal }
                >
                    Add Admin
                </Button>
            </div>
            <Modal
                title="Add Admin"
                open={ isModalOpen }
                onCancel={ handleCancel }
                footer={ null }
            >
                <Form
                    { ...layout }
                    layout="vertical"
                    onFinish={ handleSave }
                >

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={ [ {
                            required: true, message: 'Please enter a userName!'
                        } ] }
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="First name"
                        name="firstName"
                        rules={ [ {
                            required: true, message: 'Please enter a First name!'
                        } ] }
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last name"
                        name="lastName"
                        rules={ [ {
                            required: true, message: 'Please enter a Last name'
                        } ] }
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={ [ {
                            required: true, message: 'Please enter an email!'
                        } ] }
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={ [ {
                            required: true, message: 'Please enter a password!'
                        } ] }
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 21, }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default memo(AddAdmin);
