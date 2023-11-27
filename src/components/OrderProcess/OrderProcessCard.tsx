'use client';
import { Card } from 'antd';
import Ribbon from 'antd/lib/badge/Ribbon';
import { PresetColorKey } from 'antd/lib/theme/interface';

import { TOrderProcessStepsStatus } from '@/types/common';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import CardInfo from '@/components/OrderProcess/CardInfo';
import AssigneeOrderProcessSelect from '@/components/Buttons/AssigneeOrderProcessSelect';
import { useSingleOrderProcessData } from '@/store/singlOrderProcess';

import styles from './OrderProcessCard.module.scss';
import CardForm from './CardForm';


interface IOrderProcessCardProps {
    title: string;
}

function OrderProcessCard({ title }: IOrderProcessCardProps) {
    const {
        processSteps, id: orderProcessId, users
    } = useSingleOrderProcessData().state.data;

    const status: Record<TOrderProcessStepsStatus, PresetColorKey> = {
        blocked: 'volcano',
        pending: 'yellow',
        inProcess: 'cyan',
        done: 'green',
    };

    return (
        <>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <h2 className={ styles['card-title'] }>{ title }</h2>
                <AssigneeOrderProcessSelect
                    orderProcessId={ orderProcessId }
                    users={ users }
                />
            </div>
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

        </>
    );
}

export default OrderProcessCard;
