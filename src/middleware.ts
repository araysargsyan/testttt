import {withAuth} from 'next-auth/middleware';
import {type NextRequest, NextResponse} from 'next/server';


export default withAuth(
    function middleware(req: NextRequest) {
        // console.log('middleware: pathname', req.nextUrl.pathname);
        // console.log('middleware: auth cookie', req.cookies.get('next-auth.session-token'));

        // if (req.nextUrl.pathname === '/login' && req.cookies.get('next-auth.session-token')) {
        //     return NextResponse.redirect(new URL(ProtectedPages.main, req.url));
        // }

        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/login',
            // error: '/error',
            // signOut: '/login',
        },
        callbacks: {
            authorized({token, req}) {
                const isAuthenticated = Boolean(token?.accessToken)
                console.log('authorized', {isAuthenticated, token});
                return isAuthenticated;
            },
        },
    }
);

export const config = {matcher: ['/', '/users', '/admins', '/order-process', '/transaction']};
