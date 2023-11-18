import { Suspense } from 'react';
import { type Metadata, type NextPage } from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';


const UserPage: NextPage<IPageProps> = () => {
    return (
        <>
            <h1>Users</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer dataUrl={ '/user/client' } />
            </Suspense>
        </>
    );
};

export default UserPage;

export const metadata: Metadata = { title: 'Users', };
