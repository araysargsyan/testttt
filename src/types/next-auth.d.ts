// import NextAuth from 'next-auth';
import {IUserSession} from "@/types/common";

declare module 'next-auth' {
    interface Session {
        user: IUserSession;
    }

    //! returned by authorize
    // type User = IUser;
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    // type JWT = any;
}
