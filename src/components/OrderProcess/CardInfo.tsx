import {FC} from "react";
import {IStaticData} from "@/types/common";
import camelCaseToSpaces from "@/lib/util/camelCaseToSpace";
import styles from './OrderProcessCard.module.scss'

interface ICardInfo {
    staticData: IStaticData
}

const CardInfo: FC<ICardInfo> = ({staticData}) => {
    return (
        <div className={styles['card-info']}>
            <h3>{staticData.title}</h3>
            <p>{staticData.info}</p>
            {(Object.keys(staticData) as Array<keyof IStaticData>)
                .filter((k) => !['info', 'title'].includes(k))
                .map((k, i) => (
                    <div key={i}>{`${camelCaseToSpaces(k)}: ${staticData[k]}`}</div>
                ))}
        </div>
    );
}

export default CardInfo;
