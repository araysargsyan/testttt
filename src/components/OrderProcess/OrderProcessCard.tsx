'use client';
import {
    Card, List
} from 'antd';
import Ribbon from 'antd/lib/badge/Ribbon';
import { PresetColorKey } from 'antd/lib/theme/interface';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import dayjs from 'dayjs';

import {
    ERole, TOrderProcessStepsStatus
} from '@/types/common';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import CardInfo from '@/components/OrderProcess/CardInfo';
import AssigneeOrderProcessSelect from '@/components/Buttons/AssigneeOrderProcessSelect';
import { useSingleOrderProcessData } from '@/store/singlOrderProcess';
import isDateStringValid from '@/lib/util/isDateStringValid';

import styles from './OrderProcessCard.module.scss';
import CardForm from './CardForm';


interface IOrderProcessCardProps {
    title: string;
}

function OrderProcessCard({ title }: IOrderProcessCardProps) {
    const {
        processSteps, id: orderProcessId, users, flowState: { json: { allValues } }
    } = useSingleOrderProcessData().state.data;
    const { data: session } = useSession();

    const status: Record<TOrderProcessStepsStatus, PresetColorKey> = {
        blocked: 'volcano',
        pending: 'yellow',
        inProcess: 'cyan',
        done: 'green',
    };

    const renderDeepJson = useCallback((jsonKeysArray: string[], json: Record<string, any>) => {
        return (
            <List
                itemLayout="horizontal"
                dataSource={ jsonKeysArray }
                renderItem={ (key, _) => {
                    const values = json[key];
                    const isNested = typeof values === 'object';
                    const description = isNested
                        ? renderDeepJson(Object.keys(values), values)
                        : isDateStringValid(values) ? dayjs(values).toString() : camelCaseToSpaces(values);

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={ camelCaseToSpaces(key) }
                                description={ (
                                    <div style={{ paddingLeft: isNested ? '16px' : '0px' }}>
                                        { description }
                                    </div>
                                ) }
                            />
                        </List.Item>
                    );
                } }
            />
        );
    }, []);

    return (
        <>
            { [ ERole.SUPER_ADMIN, ERole.MANAGER ].includes(session?.user.role as ERole) ? (
                <div style={{
                    display: 'flex', marginBottom: '20px'
                }}
                >
                    <h2 className={ styles['card-title'] }>{ title }</h2>
                    <AssigneeOrderProcessSelect
                        orderProcessId={ orderProcessId }
                        users={ users }
                    />
                </div>
            ) : null }
            <div className={ styles['order-process-wrapper'] }>
                <div className={ styles['order-process-steps'] }>
                    { processSteps?.map((d, i) => (
                        <Ribbon
                            text={ camelCaseToSpaces(d.status) }
                            key={ d.id }
                            color={ status[d.status] }
                        >
                            <Card
                                type={ 'inner' }
                                bordered={ false }
                                className={ styles.card }
                                title={ `Step: ${d.step}` }
                            >
                                <CardInfo staticData={ d.staticData } />
                                <CardForm
                                    key={ 'card-buttons' }
                                    step={ i }
                                />
                            </Card>
                        </Ribbon>
                    )) }
                </div>
                <div className={ styles['order-process-flow-state'] }>
                    { renderDeepJson(Object.keys(allValues), allValues) }
                </div>
            </div>
        </>
    );
}

export default OrderProcessCard;
