'use client';
import {
    useState, useEffect, FC
} from 'react';
import {
    Select, Button
} from 'antd';

import axios from '@/lib/axios';
import { useUpdateSession } from '@/store/updateSession';
import { EAuthCookie } from '@/types/common';



interface IAssigneeOrderProcessSelectProps {
    orderProcessId: string;
    users: Array<Record<string | 'id', string>>;
}

const AssigneeOrderProcessSelect: FC<IAssigneeOrderProcessSelectProps> = ({
    orderProcessId, users
}) => {
    const [ userData, setUserData ] = useState<any[]>([]);
    const [ adminsIds, setAdminsIds ] = useState<any[]>([]);
    const [ buttonDisabled, setButtonDisabled ] = useState(true);
    const { current: updateSession } = useUpdateSession();

    useEffect(() => {
        axios.get('/user/admin')
            .then(({
                data, newAccessToken
            }) => {
                if (newAccessToken) {
                    updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
                }
                // console.log('GET_ADMINS_DATA', status);
                setUserData(data.result);
            }).catch((e) => {
                console.log('GET_ADMINS_DATA: ERROR', e);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Update buttonDisabled based on adminsIds length
        setButtonDisabled(adminsIds.length === 0);
    }, [ adminsIds ]);

    const onSubmit = () => {
        axios.patch(`/order-process/${orderProcessId}/assign-admin`, { adminsIds }).then(({ newAccessToken }) => {
            if (newAccessToken) {
                updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            }
            // console.log('ASSIGN_ADMIN', data);
        }).catch((e) => {
            console.log('ASSIGN_ADMIN: ERROR', e);
        });
    };

    const initialValue = users.map((el) => ({
        value: el.id, label: el.username
    }));

    return (
        <div style={{
            display: 'flex', marginLeft: '20px', width: '100%', justifyContent: 'end'
        }}
        >
            <Select
                mode="multiple"
                size={ 'middle' }
                placeholder="Please select"
                defaultValue={ initialValue }
                onChange={ (v) => setAdminsIds(v) }
                style={{
                    width: '300px', height: '32px' 
                }}
                options={ userData.map((el) => ({
                    value: el.id,
                    label: el.username
                })) }
            />
            <Button
                style={{
                    marginLeft: '10px', height: '32px', padding: ' 0 10px', display: 'flex', justifyContent: 'center', alignItems: 'center'
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
