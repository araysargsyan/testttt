import { getServerSession } from 'next-auth';

import { IResponsePayload } from '@/types/common';

import authOptions from './authOptions';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshToken(refreshToken: string) {
    const res = await fetch(BASE_URL + '/auth/refresh-access', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
        },
    });
    const data = await res.json();
    return data.accessToken;
}

export async function AuthGetApi<T = any, SINGLE = false>(url: string): Promise<SINGLE extends false ? IResponsePayload<T> : T> {
    const session = await getServerSession(authOptions);

    let res = await fetch(BASE_URL + url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
            'Content-Type': 'application/json'
        },
    });

    if (res.status == 401) {
        if (session) {
            session.user.accessToken = await refreshToken(session?.user.refreshToken);
        }
        console.log('after: ', session?.user.accessToken);

        res = await fetch(BASE_URL + url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        return await res.json();
    }

    return await res.json();
}
