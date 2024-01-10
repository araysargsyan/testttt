import { NextRequest as NR } from 'next/server';
import { AxiosResponse as AxiosResponseDefault } from 'axios';

import { IUserSession } from '@/types/common';


declare module 'axios' {
    interface AxiosResponse<T = any> extends AxiosResponseDefault<T> {
        newAccessToken?: string;
    }
}

declare module 'next/server' {
    interface NextRequest extends NR {
        user?: IUserSession;
    }
}

declare module 'next-auth' {
    interface Session {
        user: IUserSession;
    }

    // type Profile = any
    // type Account = any

    //! returned by authorize
    type User = IUserSession;
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    type JWT = IUserSession;
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

declare global {
    interface URLSearchParams {
        toObject: () => Record<string, string>;
    }
}
