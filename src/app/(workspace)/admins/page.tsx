import React, {
    memo, Suspense 
} from 'react';
import {
    type Metadata, type NextPage
} from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';
import { AdminsProvider } from '@/store/admins';
import { Providers } from '@/constants';


const AdminsPage: NextPage<IPageProps> = ({ searchParams }) => {
    return (
        <AdminsProvider>
            <h1>Admins</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    searchParams={ searchParams }
                    dataUrl={ '/user/admin' }
                    provider={ Providers.admins }
                />
            </Suspense>
        </AdminsProvider>
    );
};

export default memo(AdminsPage);

export const metadata: Metadata = { title: 'Admins', };
