'use client';
import { FC, useState } from 'react';
import { Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Search from 'antd/lib/input/Search';


const SearchBar: FC<any> = () => {
    const [ searchValue, setSearchValue ] = useState<string>('');

    const handleSearch = (value: string) => {
        // Handle the search logic here, e.g., make an API call, filter data, etc.
        console.log('Searching for:', value);
    };

    return (
        <div>
            <Space
                direction="vertical"
                style={{ width: '100%', }}
            >
                <Search
                    placeholder="Search..."
                    allowClear
                    enterButton={ <SearchOutlined /> }
                    size="large"
                    onSearch={ handleSearch }
                    onChange={ (e) => setSearchValue(e.target.value) }
                    value={ searchValue }
                />
            </Space>
        </div>
    );
};

export default SearchBar;
