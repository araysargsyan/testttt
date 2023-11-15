'use client'
import {Card} from "antd";
import CardForm from "./CardForm";
import styles from './OrderProcessCard.module.scss';
import {IProcessSteps, TOrderProcessStepsStatus} from "@/types/common";
import Ribbon from "antd/lib/badge/Ribbon";
import {PresetColorKey} from "antd/lib/theme/interface";
import camelCaseToSpaces from "@/lib/util/camelCaseToSpace";
import CardInfo from "@/components/OrderProcess/CardInfo";
import {useOrderProcessData} from "@/store/orderProcess";

interface IOrderProcessCardProps {
    data: IProcessSteps[];
    title: string;
}

function OrderProcessCard({data, title}: IOrderProcessCardProps) {
    const storeData = useOrderProcessData()
    console.log(storeData, 6666)

    const status: Record<TOrderProcessStepsStatus, PresetColorKey> = {
        blocked: 'volcano',
        pending: 'yellow',
        inProcess: 'cyan',
        done: 'green',
    }

    return <>
        <h2 className={styles['card-title']}>{title}</h2>
        {storeData.state.data?.processSteps.map((d, i) => (
            <Ribbon
                text={camelCaseToSpaces(d.status)}
                key={d.id}
                color={status[d.status]}
            >
                <Card
                    type={'inner'}
                    bordered={false}
                    // headStyle={{borderBottom: styles.card.border}}
                    className={styles.card}
                    title={`Step: ${d.step}`}
                >
                    <CardInfo staticData={d.staticData}/>
                    <CardForm
                        key={'card-buttons'}
                        // id={storeData.state.data?.id as never}
                        // status={d.status}
                        // stepId={d.id}
                        // step={d.step}
                        // inputsData={d.inputsData}
                        step={i}
                    />
                </Card>
            </Ribbon>
        ))
        }
    </>;
}

export default OrderProcessCard;
