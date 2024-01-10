'use client';

import {
    FC, memo, useEffect, useMemo, useState
} from 'react';
import {
    Select, DatePicker, Button
} from 'antd';
import Search from 'antd/lib/input/Search';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import locale from 'antd/lib/date-picker/locale/en_US';
import { usePathname } from 'next/navigation';

import {
    TProviders, useProviderDispatch
} from '@/store';
import getSearchParams from '@/lib/getSearchParams';
import { EAuthCookie } from '@/types/common';
import axios from '@/lib/axios';
import { useUpdateSession } from '@/store/updateSession';

import styles from './Table.module.scss';


interface ITableHeadProps {
    searchParams: Record<string, string>;
    columns: string[];
    provider?: TProviders;
    dataUrl: string;
}
type RangeValue = [Dayjs | null, Dayjs | null];

const TableHead: FC<ITableHeadProps> = ({
    columns, dataUrl, provider, searchParams
}) => {
    // useUpdateAccessTokenAfterUnmount();
    // const { current: updateSession } = useUpdateSession();
    const pathname = usePathname();
    const {
        dispatch, actions
    } = useProviderDispatch(provider);
    const [ searchBy, setSearchBy ] = useState<string>(searchParams.searchBy || 'all');
    const [ search, setSearch ] = useState<string>(searchParams.search || '');
    const selectOptions = useMemo(() => {
        return [ 'all', ...columns ].map((c) => ({
            value: c,
            label: c,
        }));
    }, [ columns ]);
    const [ dates, setDates ] = useState<RangeValue>([
        searchParams.startDate ? dayjs(searchParams.startDate) : null,
        searchParams.endDate ? dayjs(searchParams.endDate) : null
    ]);
    const [ open, setOpen ] = useState(false);
    const today = dayjs();

    const handleSelectChange = (value: string) => {
        setSearchBy(value || 'all');
    };

    const handleSearch = () => {
        const urlParams = getSearchParams(searchParams, location.search);
        urlParams.set('search', search);
        if (searchBy !== 'all') {
            urlParams.set('searchBy', searchBy);
        }

        // console.log('handleSearch', { params: urlParams.toObject() });
        axios.get(dataUrl, { params: urlParams.toObject() }).then(({
            data, newAccessToken
        }) => {
            // if (newAccessToken) {
            //     updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            // }
            dispatch(actions.UPDATE, { data });
            window.history.pushState({}, '', `${pathname}?${urlParams.toString()}`);
        });
    };
    const disabledDate = (current: Dayjs) => {
        return today.isBefore(current) && !today.isSame(current, 'day');
    };

    const onDone = (clear = false) => {
        const urlParams = getSearchParams(searchParams, location.search);

        if (clear) {
            setDates([ null, null ]);
            delete searchParams.startDate;
            delete searchParams.endDate;
            urlParams.delete('startDate');
            urlParams.delete('endDate');
        } else {
            if (dates[0]) {
                urlParams.set('startDate', dates[0]?.toString());
            }
            if (dates[1]) {
                urlParams.set('endDate', dates[1]?.toString());
            }
        }

        // console.log('onDone', { params: urlParams.toObject() });
        axios.get(dataUrl, { params: urlParams.toObject() }).then(({
            data, newAccessToken
        }) => {
            // if (newAccessToken) {
            //     updateSession({ [EAuthCookie.ACCESS]: newAccessToken });
            // }
            dispatch(actions.UPDATE, { data });
            window.history.pushState({}, '', `${pathname}?${urlParams.toString()}`);
        });
    };
    const onOpenChange = (open: boolean) => {
        if (!open) {
            onDone();
        }
        setOpen(open);
    };

    useEffect(() => {
        console.log('RERENDER', TableHead.name);
    });

    return (
        <div className={ styles['table-head'] }>
            <div className={ styles['table-head-search'] }>
                <Search
                    defaultValue={ searchParams.search }
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
                value={ dates }
                disabledDate={ disabledDate }
                onCalendarChange={ (val) => {
                    if (val) {
                        setDates(val);
                    } else {
                        onDone(true);
                    }
                } }
                onOpenChange={ onOpenChange }
            />
        </div>
    );
};

export default memo(TableHead);
