import React from 'react';
import {
    Modal, Form, Input, Button
} from 'antd';
import { type FormInstance } from 'antd/lib/form';


interface EditModalProps {
    isModalVisible: boolean;
    handleCancel: () => void;
    handleEdit: (record: any) => void;
    record: any;
}

const EditModal: React.FC<EditModalProps> = ({
    isModalVisible, handleCancel, handleEdit, record
}) => {
    const [ form ] = Form.useForm<FormInstance>();

    const onFinish = (values: any) => {
        handleEdit({ ...record, ...values });
        form.resetFields();
        handleCancel();
    };

    return (
        <Modal
            title="Edit Record"
            visible={ isModalVisible }
            onCancel={ handleCancel }
            footer={ null }
        >
            <Form
                form={ form }
                initialValues={ record }
                onFinish={ onFinish }
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="age"
                    label="Age"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditModal;
