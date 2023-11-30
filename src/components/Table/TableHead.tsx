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
import {
    useRouter, usePathname
} from 'next/navigation';

import useAxiosAuth from '@/hooks/useAxiosAuth';
import { TableRowLimit } from '@/components/Table/index';
import {
    TProviders, useProviderDispatch
} from '@/store';
import getSearchParams from '@/lib/getSearchParams';

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
    const router = useRouter();
    const pathname = usePathname();
    const axios = useAxiosAuth();
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
        const params: {search: string; searchBy?: string; limit: string} & ITableHeadProps['searchParams'] = {
            ...searchParams,
            search,
            limit: TableRowLimit,
        };
        if (searchBy !== 'all') {
            params.searchBy = searchBy;
        }

        axios.get(dataUrl, { params }).then(({ data }) => {
            dispatch(actions.UPDATE, { data });
            const urlParams = getSearchParams(params);
            router.push(`${pathname}?${urlParams.toString()}`);
        });
    };
    const disabledDate = (current: Dayjs) => {
        return today.isBefore(current) && !today.isSame(current, 'day');
    };

    const onDone = (clear = false) => {
        if (clear) {
            setDates([ null, null ]);
            delete searchParams.startDate;
            delete searchParams.endDate;
        }

        const params: {startDate?: string; endDate?: string; limit: string} & ITableHeadProps['searchParams'] = {
            ...searchParams,
            limit: TableRowLimit
        };

        if (!clear) {
            if (dates[0]) {
                params.startDate = dates[0]?.toString();
            }
            if (dates[1]) {
                params.endDate = dates[1]?.toString();
            }
        }

        axios.get(dataUrl, { params }).then(({ data }) => {
            dispatch(actions.UPDATE, { data });
            const urlParams = getSearchParams(params);
            router.push(`${pathname}?${urlParams.toString()}`);
        });
    };
    const onOpenChange = (open: boolean) => {
        if (!open) {
            onDone();
        }
        setOpen(open);
    };

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

export default TableHead;
