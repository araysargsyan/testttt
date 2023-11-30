import NextAuth from 'next-auth';
import {
    NextRequest, NextResponse
} from 'next/server';
import {
    NextApiRequest, NextApiResponse
} from 'next';
import {
    getToken, JWT
} from 'next-auth/jwt';

import authOptions from '@/lib/authOptions';


const handler = async (req: NextRequest, res: NextResponse) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET as string,
    }) as unknown as JWT;

    // console.log('[...nextauth]', token);
    const response = await NextAuth(req as unknown as NextApiRequest, res as unknown as NextApiResponse, {
        ...authOptions,
        session: { maxAge: token?.maxAge || authOptions.session!.maxAge! },
        // session: { maxAge: token ? (token.exp as number) - Math.floor(Date.now() / 1000) : authOptions.session!.maxAge! },
    });

    if (token && (token._v !== process.env.NEXTAUTH_COOKIE_VERSION || token.maxAge <= 0)) {
        console.log('[...nextauth]', 'FORCE LOGOUT');
        const secureCookie = process.env.NEXTAUTH_URL?.startsWith('https://') ?? !!process.env.VERCEL;
        const cookieName = secureCookie
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token';

        const secureAttribute = secureCookie ? ' Secure; ' : '';
        const httpOnlyAttribute = secureCookie ? ' httpOnly=true; ' : '';
        response.headers.set('Set-Cookie', `${cookieName}=;${secureAttribute}${httpOnlyAttribute}path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`);
    }
    return response;
};
export {
    handler as GET, handler as POST
};
