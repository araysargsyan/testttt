import OrderProcess from '@/components/OrderProcess';
import {Suspense} from "react";
import {Metadata, NextPage} from "next";
import {IOrderProcessParams} from "@/types/params";
import {IPageProps} from "@/types/core";
import Spinner from "@/components/Spiner";

const OrderProcessPage: NextPage<IPageProps<IOrderProcessParams>> = ({params: {processId}}) => {

    return (
        <Suspense fallback={<Spinner />}>
            <OrderProcess id={processId}/>
        </Suspense>
    )
};

export default OrderProcessPage;

export const metadata: Metadata = {
    title: 'Order Process',
}
