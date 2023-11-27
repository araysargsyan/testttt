import { Session, getServerSession,  } from 'next-auth';

import { EAuthCookie } from '@/types/common';

import authOptions from './authOptions';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface IAuthGetApiReturn<T = any> {
    data: T;
    session: Session | null;
    newAccessToken?: string;
}

async function refreshToken(refreshToken: string) {
    const res = await fetch(BASE_URL + '/auth/refresh-access', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
        },
    });

    console.log('refreshToken: STATUS', res.status);
    if (res.status === 201) {
        const data = await res.json() as {accessToken: string};
        return data.accessToken;
    } else {
        console.log('REFRESH ALREADY DEAD IN SERVER REQUEST');
        return null;
    }
}

export async function AuthGetApi<
    T = any,
>(url: string, cache: RequestCache = 'default'): Promise<IAuthGetApiReturn<T>> {
    const session = await getServerSession(authOptions);

    console.log(BASE_URL + url, 'URL');
    console.log(session?.user.accessToken, 'session?.user.accessToken');
    let res = await fetch(BASE_URL + url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
            'Content-Type': 'application/json'
        },
        cache,
        // next: { revalidate: 10 }
    });

    if (res.status === 401) {
        const newAccessToken = await refreshToken(session!.user[EAuthCookie.REFRESH]);
        console.log('after:refresh', { newAccessToken });

        if (newAccessToken) {
            res = await fetch(BASE_URL + url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                },
                cache
            });

            console.log('after:refetch: STATUS', res.status);
            return {
                data: await res.json(),
                newAccessToken,
                session
            } as IAuthGetApiReturn<T>;
        } else {
            throw new Error('refreshDie');
        }
    }

    return {
        data: await res.json(),
        session
    } as IAuthGetApiReturn<T>;
}
