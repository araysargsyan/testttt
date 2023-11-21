'use client';
import { Card } from 'antd';
import Ribbon from 'antd/lib/badge/Ribbon';
import { PresetColorKey } from 'antd/lib/theme/interface';

import { TOrderProcessStepsStatus } from '@/types/common';
import camelCaseToSpaces from '@/lib/util/camelCaseToSpace';
import CardInfo from '@/components/OrderProcess/CardInfo';
import { useOrderProcessData } from '@/store/orderProcess';

import styles from './OrderProcessCard.module.scss';
import CardForm from './CardForm';


interface IOrderProcessCardProps {
    // data: IProcessSteps[];
    title: string;
}

function OrderProcessCard({ title }: IOrderProcessCardProps) {
    const processSteps = useOrderProcessData().state.data?.processSteps;

    const status: Record<TOrderProcessStepsStatus, PresetColorKey> = {
        blocked: 'volcano',
        pending: 'yellow',
        inProcess: 'cyan',
        done: 'green',
    };

    return (
        <>
            <h2 className={ styles['card-title'] }>{ title }</h2>
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
                            step={ i }
                        />
                    </Card>
                </Ribbon>
            )) }
        </>
    );
}

export default OrderProcessCard;
