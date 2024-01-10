import {
    memo, Suspense 
} from 'react';
import {
    type Metadata, type NextPage
} from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';
import { OrderProcessProvider } from '@/store/orderProcess';
import { Providers } from '@/constants';


const OrderProcessPage: NextPage<IPageProps> = ({ searchParams }) => {
    return (
        <OrderProcessProvider>
            <h1>Order Process List</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    searchParams={ searchParams }
                    provider={ Providers.orderProcess }
                    isRowClickable={ true }
                    dataUrl={ '/order-process' }
                    ignoreColumns={ [ 'users' ] }
                />
            </Suspense>
        </OrderProcessProvider>
    );
};

export default memo(OrderProcessPage);

export const metadata: Metadata = { title: 'Order Process List', };



