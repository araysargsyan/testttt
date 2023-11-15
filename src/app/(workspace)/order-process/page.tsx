import Spinner from "@/components/Spiner";
import {Suspense} from "react";
import TableContainer from "@/components/Table";
import {IPageProps} from "@/types/core";
import {Metadata, NextPage} from "next";
import {OrderProcessProvider} from "@/store/orderProcess";

const OrderProcessListPage: NextPage<IPageProps> = (props) => {

    return (
        <>
            <h1>Order Process List</h1>
            <Suspense fallback={<Spinner/>}>
                <TableContainer
                    isRowClickable={true}
                    dataUrl={'/order-process'}
                    ignoreColumns={['users']}
                />
            </Suspense>
        </>
    );
};

export default OrderProcessListPage;

export const metadata: Metadata = {
    title: 'Order Process List',
}



