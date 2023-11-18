import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import { ProtectedPages } from '@/constants';
import authOptions from '@/lib/authOptions';



const LoginLayout = async ({ children }: {
    children: ReactNode;
}) => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect(ProtectedPages.main);
    }

    return (
        <section>
            { children }
        </section>
    );
};

export default LoginLayout;
