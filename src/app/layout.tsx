import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { type ReactNode } from 'react';

import authOptions from '@/lib/authOptions';
import SessionProvider from '@/lib/SessionProvider';

import StyledComponentsRegistry from '../lib/AntdRegistry';


const inter = Inter({ subsets: [ 'latin' ] });

const RootLayout = async ({ children }: {
    children: ReactNode;
}) => {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className={ inter.className }>
                <StyledComponentsRegistry>
                    <SessionProvider session={ session }>
                        { children }
                    </SessionProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
};

export default RootLayout;
