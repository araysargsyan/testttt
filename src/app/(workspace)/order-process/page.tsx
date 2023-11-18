import { Suspense } from 'react';
import { type Metadata, type NextPage } from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';


const OrderProcessListPage: NextPage<IPageProps> = () => {

    return (
        <>
            <h1>Order Process List</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    isRowClickable={ true }
                    dataUrl={ '/order-process' }
                    ignoreColumns={ [ 'users' ] }
                />
            </Suspense>
        </>
    );
};

export default OrderProcessListPage;

export const metadata: Metadata = { title: 'Order Process List', };



