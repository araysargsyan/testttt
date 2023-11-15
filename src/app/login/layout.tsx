import {Inter} from 'next/font/google';
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {ProtectedPages} from "@/constants";
import authOptions from '@/lib/authOptions';


const inter = Inter({subsets: ['latin']});

const LoginLayout = async ({children}: {
    children: React.ReactNode
}) => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect(ProtectedPages.main)
    }

    return (
        <section>
            {children}
        </section>
    )
};

export default LoginLayout;
