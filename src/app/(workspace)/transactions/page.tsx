import {Suspense} from "react";
import Spinner from "@/components/Spiner";
import TableContainer from "@/components/Table";
import {Metadata, NextPage} from "next";
import {IPageProps} from "@/types/core";

const TransactionsPage: NextPage<IPageProps> = (props) => {
    return (
        <>
            <h1>Transaction</h1>
            <Suspense fallback={<Spinner />}>
                <TableContainer dataUrl={'/transaction'} />
            </Suspense>
        </>
    )
}

export default TransactionsPage;

export const metadata: Metadata = {
    title: 'Transaction',
}
