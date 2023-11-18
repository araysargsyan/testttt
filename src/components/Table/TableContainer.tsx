import { memo } from 'react';

import { AuthGetApi } from '@/lib/fetchApi';
import { TProviders } from '@/store';

import Table from './Table';


interface ITableContainerProps {
    dataUrl: string;
    ignoreColumns?: string[];
    isRowClickable?: boolean;
    provider?: TProviders;
}

async function TableContainer({
    dataUrl,
    ignoreColumns = [],
    isRowClickable = false,
    provider
}: ITableContainerProps) {
    const data = await AuthGetApi(dataUrl).then((response) => {
        console.log('TableContainer: RESPONSE', { [dataUrl]: response.count });
        console.log('TableContainer: RESPONSE_DATA', { [dataUrl]: response.result });
        return response.result;
    }).catch(e => {
        console.log('TableContainer: ERROR', e);
        return [];
    });

    const columns = Object.keys(data[0])
        .filter((k) => k !== 'id' && !ignoreColumns.includes(k));

    return (
        <>
            { /*<TableHead columns={columns}/>*/ }
            <Table
                dataUrl={ dataUrl }
                provider={ provider }
                data={ data }
                columns={ columns }
                isRowClickable={ isRowClickable }
            />
        </>
    );
}

export default memo(TableContainer);
