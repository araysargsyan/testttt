import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

import { EAuthCookie } from '@/types/common';


export default function setAccessToken(initialSession?: Session | string) {
    if (initialSession) {
        localStorage.setItem(
            EAuthCookie.ACCESS,
            typeof initialSession === 'string'
                ? initialSession
                : initialSession!.user[EAuthCookie.ACCESS]
        );
    } else {
        getSession().then((session) => {
            localStorage.setItem(
                EAuthCookie.ACCESS,
                session!.user[EAuthCookie.ACCESS]
            );
        });
    }
}
