import React, { Suspense } from 'react';
import { type Metadata, type NextPage } from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';
import { AdminsProvider } from '@/store/admins';
import PageHeader from '@/components/PageHeader/PageHeader';


const AdminsPage: NextPage<IPageProps> = () => {
    return (
        <AdminsProvider>
            <PageHeader title={ 'Admins' } />
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    dataUrl={ '/user/admin' }
                    provider={ 'admins' }
                />
            </Suspense>
        </AdminsProvider>
    );
};

export default AdminsPage;

export const metadata: Metadata = { title: 'Admins', };
