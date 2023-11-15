import {IPageProps} from "@/types/core";
import {Metadata, NextPage} from "next";

const Home: NextPage<IPageProps> = (props) => {
    return (
        <section>
            dashboard
        </section>
    )
}

export default Home;

export const metadata: Metadata = {
    title: 'Dashboard',
}
