import {
    memo, Suspense
} from 'react';
import {
    type Metadata,  NextPage
} from 'next';

import Spinner from '@/components/Spiner';
import TableContainer from '@/components/Table';
import { type IPageProps } from '@/types/core';
import { ContactRequestsProvider } from '@/store/contactRequests';
import { Providers } from '@/constants';


const ContactRequestsPage: NextPage<IPageProps> = ({ searchParams }) => {
    return (
        <ContactRequestsProvider>
            <h1>Contact requests</h1>
            <Suspense fallback={ <Spinner /> }>
                <TableContainer
                    searchParams={ searchParams }
                    dataUrl={ '/contact-request' }
                    provider={ Providers.contactRequests }
                />
            </Suspense>
        </ContactRequestsProvider>
    );
};

export default memo(ContactRequestsPage);

export const metadata: Metadata = { title: 'Contact request', };
