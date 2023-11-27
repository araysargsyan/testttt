'use client';
import {
    useState, useEffect, FC 
} from 'react';
import { Select, Button } from 'antd';

import useAxiosAuth from '@/hooks/useAxiosAuth';


interface IAssigneeOrderProcessSelectProps {
    orderProcessId: string;
    users: Array<Record<string | 'id', string>>;
}

const AssigneeOrderProcessSelect: FC<IAssigneeOrderProcessSelectProps> = ({ orderProcessId, users }) => {
    const axios = useAxiosAuth();
    const [ userData, setUserData ] = useState<any[]>([]);
    const [ adminsIds, setAdminsIds ] = useState<any[]>([]);
    const [ buttonDisabled, setButtonDisabled ] = useState(true);

    useEffect(() => {
        axios.get('/user/admin')
            .then((res) => {
                setUserData(res.data.result);
            }).catch((e) => {
                console.log('GET_ADMINS_DATA: ERROR', e);
            });
    }, [ axios ]);

    useEffect(() => {
        // Update buttonDisabled based on adminsIds length
        setButtonDisabled(adminsIds.length === 0);
    }, [ adminsIds ]);

    const onSubmit = () => {
        axios.patch(`/order-process/${orderProcessId}/assign-admin`, { adminsIds }).then((res) => {
            console.log('ASSIGN_ADMIN', res.data);
        }).catch((e) => {
            console.log('ASSIGN_ADMIN: ERROR', e);
        });
    };

    const initialValue = users.map((el) => ({ value: el.id, label: el.username }));

    console.log({
        adminsIds, userData, users
    });

    return (
        <div style={{
            display: 'flex', marginLeft: '40px', width: '100%', justifyContent: 'end'
        }}
        >
            <Select
                mode="multiple"
                size={ 'middle' }
                placeholder="Please select"
                defaultValue={ initialValue }
                onChange={ (v) => setAdminsIds(v) }
                style={{ width: '300px' }}
                options={ userData.map((el) => ({
                    value: el.id,
                    label: el.username
                })) }
            />
            <Button
                style={{
                    marginLeft: '10px', height: '42px', padding: ' 0 10px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}
                type="primary"
                onClick={ onSubmit }
                disabled={ buttonDisabled }
            >
                Assign
            </Button>
        </div>
    );
};

export default AssigneeOrderProcessSelect;
