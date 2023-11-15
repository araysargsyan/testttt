import {FC, useMemo} from "react";
import SearchBar from "@/components/SearchBar/SearchBar";
import {Select} from "antd";
import {SelectProps} from "rc-select/lib/Select";
import styles from "./Table.module.scss";

interface ITableHeadProps {
    columns: string[]
}

const TableHead: FC<ITableHeadProps> = ({columns}) => {
    const selectOptions: SelectProps['options'] = useMemo(() => {
        return ['all', ...columns].map((c) => ({
            value: c,
            label: c,
        }))
    }, [])

    return (
        <div className={styles['table-head']}>
            <SearchBar />
            <Select
                defaultValue={selectOptions[0].value}
                style={{ width: 120 }}
                allowClear
                options={selectOptions}
            />
        </div>
    );
}

export default TableHead;
