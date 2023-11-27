import { Suspense } from 'react';
import { type Metadata,  NextPage } from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';
import { TransactionsProvider } from '@/store/transactions';
import { Providers } from '@/constants';


const TransactionsPage: NextPage<IPageProps> = ({ searchParams }) => {
    return (
        <TransactionsProvider>
            <h1>Transaction</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    searchParams={ searchParams }
                    dataUrl={ '/transaction' }
                    provider={ Providers.transactions }
                />
            </Suspense>
        </TransactionsProvider>
    );
};

export default TransactionsPage;

export const metadata: Metadata = { title: 'Transaction', };
