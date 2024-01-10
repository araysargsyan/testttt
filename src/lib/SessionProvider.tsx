'use client';

import { SessionProvider as Provider } from 'next-auth/react';
import {
    ReactNode, useLayoutEffect,
} from 'react';
import { Session } from 'next-auth';

import setAccessToken from '@/lib/util/setAccessToken';
import { UpdateSessionProvider } from '@/store/updateSession';


export default function SessionProvider({
    children,
    session,
}: {
    children: ReactNode;
    session: Session | null;
}) {
    useLayoutEffect(() => {
        if (session) {
            setAccessToken(session);
        }
    }, [ session ]);

    // console.log('SessionProvider', session);
    return (
        <Provider session={ session }>
            <UpdateSessionProvider>
                { children }
            </UpdateSessionProvider>
        </Provider>
    );
}
