import { Suspense } from 'react';
import { type Metadata, type NextPage } from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';
import { UsersProvider } from '@/store/users';
import { Providers } from '@/constants';


const UserPage: NextPage<IPageProps> = ({ searchParams }) => {
    return (
        <UsersProvider>
            <h1>Users</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    searchParams={ searchParams }
                    dataUrl={ '/user/client' }
                    provider={ Providers.users }
                />
            </Suspense>
        </UsersProvider>
    );
};

export default UserPage;

export const metadata: Metadata = { title: 'Users', };
