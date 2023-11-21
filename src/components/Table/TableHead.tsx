'use client';

import {
    FC, useMemo, useState
} from 'react';
import {
    Select, DatePicker, Button
} from 'antd';
import Search from 'antd/lib/input/Search';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'antd/lib/date-picker/locale/en_US';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import { AdminsActions, useAdminsDispatch } from '@/store/admins';
import { TableRowLimit } from '@/components/Table/index';

import styles from './Table.module.scss';


interface ITableHeadProps {
    columns: string[];
    dataUrl: string;
}
type RangeValue = [Dayjs | null, Dayjs | null];


const TableHead: FC<ITableHeadProps> = ({ columns, dataUrl }) => {
    const axios = useAxiosAuth();
    const dispatch = useAdminsDispatch();
    const selectOptions = useMemo(() => {
        return [ 'all', ...columns ].map((c) => ({
            value: c,
            label: c,
        }));
    }, [ columns ]);

    const [ searchBy, setSearchBy ] = useState<string>('all'); // Set the initial value to 'all'
    const [ search, setSearch ] = useState<string>('');

    const handleSelectChange = (value: string) => {
        setSearchBy(value || 'all');
    };

    const handleSearch = () => {
        const searchParams: {search: string; searchBy?: string; limit: number} = {
            search,
            limit: TableRowLimit
        };
        if (searchBy !== 'all') {
            searchParams.searchBy = searchBy;
        }

        axios.get(dataUrl, { params: searchParams }).then(({ data }) => {
            dispatch(AdminsActions.UPDATE, { data });
        });
    };

    const [ dates, setDates ] = useState<RangeValue>([ null, null ]);
    const [ open, setOpen ] = useState(false);
    const today = dayjs();

    const disabledDate = (current: Dayjs) => {
        return today.isBefore(current) && !today.isSame(current, 'day');
    };

    const onDone = () => {
        const searchParams: {startDate?: string; endDate?: string; limit: number} = { limit: TableRowLimit };
        if (dates[0]) {
            searchParams.startDate = dates[0]?.toString();
        }
        if (dates[1]) {
            searchParams.endDate = dates[1]?.toString();
        }

        axios.get(dataUrl, { params: searchParams }).then(({ data }) => {
            dispatch(AdminsActions.UPDATE, { data });
        });
    };
    const onOpenChange = (open: boolean) => {
        console.log('onOpenChange', { open, dates });
        if (!open) {
            onDone();
        }
        setOpen(open);
    };

    return (
        <div className={ styles['table-head'] }>
            <div className={ styles['table-head-search'] }>
                <Search
                    placeholder="Search..."
                    allowClear
                    enterButton={ <SearchOutlined /> }
                    onSearch={ handleSearch }
                    onChange={ (e) => setSearch(e.target.value) }
                />
                <Select
                    style={{ width: 100 }}
                    defaultValue={ searchBy }
                    placeholder="Select a value"
                    onChange={ handleSelectChange }
                    allowClear={ searchBy !== 'all' }
                >
                    { selectOptions.map((el, i) => (
                        <Select.Option
                            key={ i }
                            value={ el.value }
                        >
                            { el.label }
                        </Select.Option>
                    )) }
                </Select>
            </div>

            <DatePicker.RangePicker
                locale={{
                    ...locale,
                    lang: {
                        ...locale.lang,
                        ok: 'Save',
                    }
                }}
                open={ open }
                renderExtraFooter={ () => {
                    return (
                        <Button
                            onClick={ () => {
                                onDone();
                                setOpen(false);
                            } }
                            size={ 'small' }
                            type={ 'primary' }
                            className={ styles['range-picker-done'] }
                        >
                            Done
                        </Button>
                    );
                } }
                style={{ width: 200 }}
                showTime
                // allowClear={ false }
                // suffixIcon={ null }
                onOk={ (dates) => {
                    console.log(dates, 333);
                } }
                value={ dates }
                disabledDate={ disabledDate }
                onCalendarChange={ (val) => {
                    console.log('onCalendarChange');
                    if (val) {
                        setDates(val);
                    }
                } }
                // onChange={ (val) => {
                //     console.log('onChange');
                //     setValue(val);
                // } }
                onOpenChange={ onOpenChange }
                // changeOnBlur
            />
        </div>
    );
};

export default TableHead;
