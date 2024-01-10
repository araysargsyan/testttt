'use client';
import { useSession } from 'next-auth/react';
import {
    FC, PropsWithChildren, useLayoutEffect
} from 'react';

import { EAuthCookie } from '@/types/common';
import logout from '@/lib/util/logout';
import setAccessToken from '@/lib/util/setAccessToken';


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
            logout();
        }

        if (
            rememberMe
            && status !== 'loading'
            && newAccessToken
            && session?.user[EAuthCookie.ACCESS] === oldAccessToken
            && session?.user[EAuthCookie.ACCESS] !== newAccessToken
        ) {
            setAccessToken(newAccessToken);
            update({ accessToken: newAccessToken })
                .then((data) => {
                    console.log('UpdateAccessToken[update]', data?.user[EAuthCookie.ACCESS]);
                }).catch((e) => {
                    console.log('UpdateAccessToken[update]: ERROR', e);
                });
        }
    }, [ newAccessToken, oldAccessToken, rememberMe, session, status, update ]);

    useLayoutEffect(() => {
        if (rememberMe) {
            if (isRefreshDie) {
                console.log('UpdateAccessToken: refresh token died');
                logout();
            }
        }
    }, [ isRefreshDie, rememberMe ]);

    if (isRefreshDie) {
        return null;
    }

    return children;
};

export default UpdateAccessToken;
