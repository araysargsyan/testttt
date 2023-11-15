import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { name: 'Username', type: 'text' },
                password: { name: 'Password', type: 'password' },
                remember: { name: 'Remember', type: 'checkbox' },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
                console.log('authorize', {BASE_URL, credentials})

                try {
                    const res = await fetch(`${BASE_URL}/auth/admin/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password,
                            rememberMe: credentials?.remember === 'true',
                        }),
                    });

                    if (res.status !== 200) {
                        throw res;
                    }

                    const user = await res.json();
                    console.log('authorize', { user, res });

                    if (user) {
                        return user;
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
    // pages: {
    //     signIn: "/auth/signIn",
    // },
    // pages: { signIn: '/login' },
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //     console.log('signIn', {user, account, profile, email, credentials})
        //     return true
        // },
        // redirect({url, baseUrl}) {
        //     console.log('redirect', {url, baseUrl})
        //     return baseUrl
        // },
        async jwt({
                      token, user, account
                  }) {
            // console.log({ account });

            return { ...token, ...user };
        },
        async session({
                          session, token, user
                      }) {
            session.user = token as never;

            return session;
        },
    },
};

export default authOptions
