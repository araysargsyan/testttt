import { Suspense } from 'react';
import { type Metadata, type NextPage } from 'next';

import OrderProcess from '@/components/OrderProcess';
import { type IOrderProcessParams } from '@/types/params';
import { type IPageProps } from '@/types/core';
import Spinner from '@/components/Spiner';


const OrderProcessPage: NextPage<IPageProps<IOrderProcessParams>> = ({ params: { processId } }) => {

    return (
        <Suspense fallback={ <Spinner /> }>
            <OrderProcess id={ processId } />
        </Suspense>
    );
};

export default OrderProcessPage;

export const metadata: Metadata = { title: 'Order Process', };
