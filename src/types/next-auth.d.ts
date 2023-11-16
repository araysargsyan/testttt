// import NextAuth from 'next-auth';
import {IJwtPayload, IUserSession} from "@/types/common";

declare module 'next-auth' {
    interface Session {
        user: IUserSession;
    }

    // type Profile = any
    // type Account = any

    //! returned by authorize
    type User = IUserSession & IJwtPayload
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    type JWT = IUserSession;
}
