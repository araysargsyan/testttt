import React, { useState } from 'react';
import {
    Button, Modal 
} from 'antd';


const DeleteButton: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                type={ 'primary' }
                danger
                onClick={ showModal }
            >
                Delete
            </Button>
            <Modal
                title="Basic Modal"
                open={ isModalOpen }
                onOk={ handleOk }
                onCancel={ handleCancel }
            >
                <p>Are you sure ?</p>
            </Modal>
        </>
    );
};

export default DeleteButton;
