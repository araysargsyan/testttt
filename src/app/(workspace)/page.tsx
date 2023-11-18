import { type Metadata, type NextPage } from 'next';

import { type IPageProps } from '@/types/core';


const Home: NextPage<IPageProps> = () => {
    return (
        <section>
            dashboard
        </section>
    );
};

export default Home;

export const metadata: Metadata = { title: 'Dashboard', };
