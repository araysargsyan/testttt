import {
    signOut, useSession 
} from 'next-auth/react';
import { useCallback } from 'react';

import axios, { axiosAuth } from '@/lib/axios';
import { EAuthCookie } from '@/types/common';


const useAxiosAuth = () => {
    const {
        data: session, update
    } = useSession();

    const refreshToken = useCallback(async () => {
        try {
            const res = await axios.get<{
                [EAuthCookie.ACCESS]: EAuthCookie.ACCESS;
            }>(
                '/auth/refresh-access',
                { headers: { Authorization: `Bearer ${session?.user.refreshToken}` } }
            );
            if (res.status === 201) {
                update({ [EAuthCookie.ACCESS]: res.data[EAuthCookie.ACCESS] });
                return res.data[EAuthCookie.ACCESS];
            } else {
                // signIn();
                signOut();
            }
        } catch (e) {
            console.log('useAxiosAuth: ERROR', e);
            signOut({ callbackUrl: '/login' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    axiosAuth.interceptors.request.use(
        (config) => {
            if (!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${session?.user?.accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosAuth.interceptors.response.use(
        (response) => response,
        async (error) => {
            const prevRequest = error?.config;
            if (error?.response?.status === 401 && !prevRequest?.sent) {
                prevRequest.sent = true;
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosAuth(prevRequest);
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosAuth;
};

export default useAxiosAuth;
