'use client';

import { SessionProvider as Provider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';


export default function SessionProvider({
    children,
    session,
}: {
    children: ReactNode;
    session: Session | null;
}) {
    return (
        <Provider session={ session }>
            { children }
        </Provider>
    );
}
