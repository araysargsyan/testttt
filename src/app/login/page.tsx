import { Suspense } from 'react';
import { type  Metadata, type NextPage } from 'next';

import { type IPageProps } from '@/types/core';
import LoginForm from '@/components/LoginForm';
import Spinner from '@/components/Spiner';


const LoginPage: NextPage<IPageProps> = () => {
    return (
        <Suspense fallback={ <Spinner /> }>
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;

export const metadata: Metadata = { title: 'Login', };
