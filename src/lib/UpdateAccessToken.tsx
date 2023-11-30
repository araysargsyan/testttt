'use client';
import {
    signOut, useSession 
} from 'next-auth/react';
import {
    FC, PropsWithChildren, useLayoutEffect
} from 'react';

import { EAuthCookie } from '@/types/common';


const UpdateAccessToken: FC<PropsWithChildren<{
    newAccessToken?: string;
    oldAccessToken?: string;
    isRefreshDie?: boolean;
}>> = ({
    newAccessToken,
    oldAccessToken,
    isRefreshDie,
    children
}) => {
    const {
        update,
        data: session,
        status
    } = useSession();
    const rememberMe = Boolean(session?.user[EAuthCookie.REFRESH]);

    useLayoutEffect(() => {
        if (session?.user && session.user.maxAge <= 0) {
            console.log('UpdateAccessToken: session expired');
            signOut();
        }

        if (
            rememberMe
            && status !== 'loading'
            && newAccessToken
            && session?.user[EAuthCookie.ACCESS] === oldAccessToken
            && session?.user[EAuthCookie.ACCESS] !== newAccessToken
        ) {
            update({ accessToken: newAccessToken })
                .then((d) => {
                    console.log(session?.user.maxAge, 'UpdateAccessToken[update]', newAccessToken, d);
                }).catch((e) => {
                    console.log(session?.user.maxAge, 'UpdateAccessToken[update]: ERROR', e);
                });
        }
    }, [ newAccessToken, oldAccessToken, rememberMe, session, status, update ]);

    useLayoutEffect(() => {
        if (rememberMe) {
            if (isRefreshDie) {
                console.log('UpdateAccessToken: refresh token died');
                signOut();
            }
        }
    }, [ isRefreshDie, rememberMe ]);

    if (isRefreshDie) {
        return null;
    }

    return children;
};

export default UpdateAccessToken;
