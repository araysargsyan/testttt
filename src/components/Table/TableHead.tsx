'use client';

import React, {
    FC, useMemo, useState 
} from 'react';
import {
    Select, DatePicker, Space 
} from 'antd';
import dayjs from 'dayjs';

import SearchBar from '@/components/SearchBar/SearchBar';

import styles from './Table.module.scss';



const { RangePicker } = DatePicker;

interface ITableHeadProps {
    columns: string[];
}
const dateFormat = 'YYYY/MM/DD';



const TableHead: FC<ITableHeadProps> = ({ columns }) => {
    const selectOptions = useMemo(() => {
        return [ 'all', ...columns ].map((c) => ({
            value: c,
            label: c,
        }));
    }, [ columns ]);

    const { Option } = Select;

    const [ selectedValue, setSelectedValue ] = useState<string>('all'); // Set the initial value to 'all'
    const [ searchInput, setSearchInput ] = useState<string>('');

    const handleSelectChange = (value: string) => {
        setSelectedValue(value);
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
    };

    const handleSearchClick = () => {
        // Log the selected value and search input to the console
        console.log('Selected Value:', selectedValue);
        console.log('Search Input:', searchInput);

        // Add additional logic related to search if needed
    };

    return (
        <div className={ styles['table-head'] }>
            <Select
                style={{ width: 100, height: '40px' }}
                dropdownRender={ (menu) => (
                    <div style={{ width: 100 }}>
                        { menu }
                    </div>
                ) }
                defaultValue={ selectedValue } // Set defaultValue to the initial value
                placeholder="Select a value"
                onChange={ handleSelectChange }
                value={ selectedValue }
                allowClear={ selectedValue !== 'all' } // Show clear button only if the selected value is not 'all'
            >
                { selectOptions.map((el, i) => (
                    <Option
                        key={ i }
                        value={ el.value }
                    >
                        { el.label }
                    </Option>
                )) }
            </Select>
            <SearchBar
                onSearchClick={ handleSearchClick }
                onSearchChange={ handleSearchChange }
            />
            <Space
                direction="vertical"
                size={ 5 }
            >
                <RangePicker
                    style={{ width: 150, height: '40px' }}
                    format={ dateFormat }
                />
            </Space>
        </div>
    );
};

export default TableHead;
