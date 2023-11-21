import { memo } from 'react';

import { AuthGetApi } from '@/lib/fetchApi';
import { TProviders } from '@/store';
import TableHead from '@/components/Table/TableHead';

import Table from './Table';
import { TableRowLimit } from './';


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
    const data = await AuthGetApi(`${dataUrl}?limit=${TableRowLimit}`).then((response) => {
        console.log('TableContainer: RESPONSE', { [dataUrl]: response.count });
        console.log('TableContainer: RESPONSE_DATA', { [dataUrl]: response.result.length });
        return response;
    }).catch(e => {
        console.log('TableContainer: ERROR', e);
        return { result: [] };
    });

    const columns = Object.keys(data.result[0])
        .filter((k) => k !== 'id' && !ignoreColumns.includes(k));

    return (
        <>
            <TableHead
                dataUrl={ dataUrl }
                columns={ columns }
            />
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
