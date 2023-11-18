import { Suspense } from 'react';
import { type Metadata,  NextPage } from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';


const TransactionsPage: NextPage<IPageProps> = () => {
    return (
        <>
            <h1>Transaction</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer dataUrl={ '/transaction' } />
            </Suspense>
        </>
    );
};

export default TransactionsPage;

export const metadata: Metadata = { title: 'Transaction', };
