import {withAuth} from 'next-auth/middleware';
import {type NextRequest, NextResponse} from 'next/server';
import {ProtectedPages} from "@/constants";


export default withAuth(
    function middleware(req: NextRequest) {
        console.log('middleware: pathname', req.nextUrl.pathname);
        console.log('middleware: auth cookie', req.cookies.get('next-auth.session-token'));
        console.log('middleware: user', req.user);

        // //! FOR EXAMPLE
        // if (
        //     req.cookies.get('next-auth.session-token')
        //     && req.user.role === 'superAdmin'
        //     && req.nextUrl.pathname === ProtectedPages.transaction
        // ) {
        //     return NextResponse.redirect(new URL(ProtectedPages.main, req.url));
        // }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({token, req}) {
                const isAuthenticated = Boolean(token?.accessToken)
                if (token) {
                    req.user = token
                }
                console.log('authorized', {isAuthenticated, token});
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
        '/transactions'
    ]
};
