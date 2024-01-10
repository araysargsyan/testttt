import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import {
    decode, encode
} from 'next-auth/jwt';
import { type AuthOptions } from 'next-auth';

import {
    EAuthCookie, type IJwtPayload, type IUserSession
} from '@/types/common';


const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    name: 'Username', type: 'text'
                },
                password: {
                    name: 'Password', type: 'password'
                },
                remember: {
                    name: 'Remember', type: 'checkbox'
                },
            },
            async authorize(credentials, _) {
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
                const rememberMe = credentials?.remember === 'true';
                console.log('authorize', {
                    BASE_URL, credentials
                });

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
                    // console.log('authorize', {
                    //     user, rememberMe
                    // });
                    const payload = rememberMe
                        ? jwtDecode<IJwtPayload>(user[EAuthCookie.REFRESH])
                        : jwtDecode<IJwtPayload>(user[EAuthCookie.ACCESS]);
                    // console.log('authorize', { payload });

                    if (user) {
                        return {
                            ...user,
                            ...payload,
                            maxAge: (payload.exp - Math.floor(Date.now() / 1000)),
                            _v: process.env.NEXTAUTH_COOKIE_VERSION as string
                        };
                    } else {
                        return null;
                    }

                } catch (e) {
                    console.log('authorize: ERROR', e);
                    console.log('authorize: ERROR', JSON.stringify(e, null, 2));

                    return null;
                }
            },
        }),
    ],
    jwt: {
        maxAge: 0,
        async decode(params) {
            try {
                const token = await decode(params);
                // console.log('decode', token);
                return token;
            } catch (e) {
                console.log('decode: ERROR', { params });
                return null;
            }
        },
        async encode(params) {
            const maxAge = (params.token?.exp as number) - Math.floor(Date.now() / 1000);
            // console.log('encode', { maxAge, token: { ...params.token, maxAge } });
            const cookie = await encode({
                token: {
                    ...params.token, maxAge
                },
                secret: params.secret,
                maxAge
            });

            return cookie;
        }
    },
    pages: {
        signIn: '/login',
        verifyRequest: '/login'
    },
    session: { maxAge: 10 },
    callbacks: {
        async jwt(params) {
            if (params.trigger === 'update') {
                // console.log('jwt: UPDATE', params.session);
                params.token = {
                    ...params.token,
                    ...params.session
                };
            }
            // console.log('jwt', params);
            return {
                ...params.token, ...params.user,
            };
        },
        async session(params) {
            // console.log('session', params.token);

            params.session.user = params.token;
            // console.log('session', params.session.user, params.newSession, params.trigger);
            return params.session;
        },
    },
};

export default authOptions;
