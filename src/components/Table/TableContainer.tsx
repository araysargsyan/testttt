import { memo } from 'react';

import {
    AuthGetApi, IAuthGetApiReturn
} from '@/lib/fetchApi';
import { TProviders } from '@/store';
import TableHead from '@/components/Table/TableHead';
import getSearchParams from '@/lib/getSearchParams';
import AddAdmin from '@/components/Forms/AddAdmin';
import {
    EAuthCookie, ERole, IResponsePayload
} from '@/types/common';
import { Providers } from '@/constants';
import UpdateAccessToken from '@/lib/UpdateAccessToken';

import Table from './Table';
import { TableRowLimit } from './';


interface ITableContainerProps {
    searchParams: Record<string, string>;
    dataUrl: string;
    ignoreColumns?: string[];
    isRowClickable?: boolean;
    provider?: TProviders;
}

async function TableContainer({
    dataUrl,
    searchParams,
    ignoreColumns = [],
    isRowClickable = false,
    provider
}: ITableContainerProps) {
    const urlParams = getSearchParams(searchParams, `?limit=${TableRowLimit}`);
    let isRefreshDie = false;
    const {
        data, newAccessToken, session
    } = await AuthGetApi<IResponsePayload<any>>(`${dataUrl}?${urlParams.toString()}`).then((response) => {
        console.log('TableContainer: RESPONSE: newAccessToken', { [dataUrl]: response.newAccessToken });
        console.log('TableContainer: RESPONSE: oldAccessToken', { [dataUrl]: response.session?.user[EAuthCookie.ACCESS] });
        console.log('TableContainer: RESPONSE: count', { [dataUrl]: response.data.count });
        console.log('TableContainer: RESPONSE: data_length', { [dataUrl]: response.data.result?.length });
        return response;
    }).catch(e => {
        console.log('TableContainer: ERROR', e);
        if (e.message === 'refreshDie') {
            isRefreshDie = true;
        }
        return { data: { result: [] } } as IAuthGetApiReturn;
    });

    const columns = Object.keys(data.result?.[0] || [])
        .filter((k) => k !== 'id' && !ignoreColumns.includes(k));

    return (
        <UpdateAccessToken
            newAccessToken={ newAccessToken }
            oldAccessToken={ session?.user[EAuthCookie.ACCESS] }
            isRefreshDie={ isRefreshDie }
        >
            { provider === Providers.admins && [ ERole.SUPER_ADMIN, ERole.MANAGER ].includes(session?.user.role as ERole)
                ? <AddAdmin />
                : null }
            <TableHead
                searchParams={ urlParams.toObject() }
                provider={ provider }
                dataUrl={ dataUrl }
                columns={ columns }
            />
            <Table
                searchParams={ urlParams.toObject() }
                dataUrl={ dataUrl }
                provider={ provider }
                data={ data }
                columns={ columns }
                isRowClickable={ isRowClickable }
            />
        </UpdateAccessToken>
    );
}

export default memo(TableContainer);
