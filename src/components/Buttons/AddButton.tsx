'use client';
import {
    FC, memo, useState
} from 'react';
import {
    Button, Modal, Form, Input
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import {
    AdminsActions, useAdminsDispatch 
} from '@/store/admins';


const AddButton: FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const axios = useAxiosAuth();
    const dispatch = useAdminsDispatch();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleSave = (values: any) => {
        axios.get('/role').then(({ data }) => {
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
            }).then((res) => {
                console.log('CREATE_ADMIN: SUCCESS', res);
                dispatch(AdminsActions.ADD, { data: { result: res.data } });
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

export default memo(AddButton);
