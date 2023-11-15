import {Suspense} from "react";
import Spinner from "@/components/Spiner";
import TableContainer from "@/components/Table";
import {Metadata, NextPage} from "next";
import {IPageProps} from "@/types/core";

const UserPage: NextPage<IPageProps> = () => {
    return (
        <>
            <h1>Users</h1>
            <Suspense fallback={<Spinner />}>
                <TableContainer dataUrl={'/user/client'} />
            </Suspense>
        </>
    )
}

export default UserPage;

export const metadata: Metadata = {
    title: 'Users',
}
