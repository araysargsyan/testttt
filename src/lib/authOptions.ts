import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import { encode } from 'next-auth/jwt';
import { type AuthOptions } from 'next-auth';

import {
    EAuthCookie,
    type IJwtPayload,
    type IUserSession
} from '@/types/common';


const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { name: 'Username', type: 'text' },
                password: { name: 'Password', type: 'password' },
                remember: { name: 'Remember', type: 'checkbox' },
            },
            async authorize(credentials, req) {
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
                const rememberMe = credentials?.remember === 'true';
                console.log('authorize', { BASE_URL, credentials });

                try {
                    const res = await fetch(`${BASE_URL}/auth/admin/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password,
                            rememberMe
                        }),
                    });

                    if (res.status !== 200) {
                        throw res;
                    }

                    const user: IUserSession = await res.json();
                    console.log('authorize', { user, rememberMe });
                    const payload = rememberMe
                        ? jwtDecode<IJwtPayload>(user[EAuthCookie.REFRESH])
                        : jwtDecode<IJwtPayload>(user[EAuthCookie.ACCESS]);
                    console.log('authorize', { payload });

                    if (user) {
                        return { ...user, ...payload };
                    } else {
                        return null;
                    }

                } catch (e) {
                    console.log('authorize: ERROR', e);

                    return null;
                }
            },
        }),
    ],
    jwt: {
        // decode(params) {
        //     console.log('decode', params)
        //     return null
        // },
        encode(params) {
            const currentTime = Math.floor(Date.now() / 1000);
            const newMaxAge = (params.token as any)?.exp - currentTime;
            params.maxAge = newMaxAge;

            return encode(params);
        }
    },
    pages: {
        signIn: '/login',
        verifyRequest: '/login',
        // error: '/login'
        // signOut: '/login',
    },
    callbacks: {
        async jwt({
            token, user, account
        }) {
            // console.log('jwt', { token, user, account });
            return { ...token, ...user };
        },
        async session({
            session, token, user 
        }) {
            // console.log('session', { session, token, user });
            session.user = token;

            return session;
        },
    },
};

export default authOptions;
