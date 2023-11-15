import {Suspense} from "react";
import Spinner from "@/components/Spiner";
import TableContainer from "@/components/Table";
import {Metadata, NextPage} from "next";
import {IPageProps} from "@/types/core";

const AdminsPage: NextPage<IPageProps> = () => {
    return (
        <>
            <h1>Admins</h1>
            <Suspense fallback={<Spinner/>}>
                <TableContainer dataUrl={'/user/admin'}/>
            </Suspense>
        </>
    )
}

export default AdminsPage;

export const metadata: Metadata = {
    title: 'Admins',
}
