import { withAuth } from 'next-auth/middleware';
import { type NextRequest, NextResponse } from 'next/server';


export default withAuth(
    async function middleware(req: NextRequest) {
        console.log('middleware: pathname', req.nextUrl.pathname);
        // console.log('middleware: auth cookie', req.cookies.get('next-auth.session-token'));
        // console.log('middleware: user', req.user);
        // const token = (await getToken({
        //     req,
        //     secret: process.env.NEXTAUTH_SECRET as string,
        // }))?.maxAge;
        // console.log(token, 11111);

        // //! FOR EXAMPLE
        // if (
        //     req.cookies.get('next-auth.session-token')
        //     && req.user.role === 'superAdmin'
        //     && req.nextUrl.pathname === ProtectedPages.transaction
        // ) {
        //     return NextResponse.redirect(new URL(ProtectedPages.main, req.url));
        // }

        const res = NextResponse.next();
        return res;
    },
    {
        // pages: { signIn: '/login' },
        callbacks: {
            authorized({ token, req }) {
                const isAuthenticated = Boolean(token && token.accessToken && token.maxAge > 0);

                console.log('authorized', { isAuthenticated, token });
                return isAuthenticated;
            },
        },
    }
);

export const config = {
    matcher: [
        '/',
        '/users',
        '/admins',
        '/order-process/:processId*',
        '/transactions',
    ]
};
