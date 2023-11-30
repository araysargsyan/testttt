import { Suspense } from 'react';
import {
    type Metadata, type NextPage 
} from 'next';

import { type IOrderProcessParams } from '@/types/params';
import { type IPageProps } from '@/types/core';
import Spinner from '@/components/Spiner';
import SingleOrderProcessContainer from '@/components/OrderProcess';


const SingleOrderProcessPage: NextPage<IPageProps<IOrderProcessParams>> = ({ params: { processId } }) => {
    return (
        <Suspense fallback={ <Spinner /> }>
            <SingleOrderProcessContainer id={ processId } />
        </Suspense>
    );
};

export default SingleOrderProcessPage;

export const metadata: Metadata = { title: 'Single Order Process', };
