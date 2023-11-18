import {
    signIn, signOut, useSession
} from 'next-auth/react';
import { useCallback } from 'react';

import axios, { axiosAuth } from '@/lib/axios';


const useAxiosAuth = () => {
    const { data: session } = useSession();

    const refreshToken = useCallback(async () => {
        try {
            const res = await axios.get('/auth/refresh-access', { headers: { Authorization: `Bearer ${session?.user.refreshToken}` } });
            console.log('useAxiosAuth: refreshToken', res);

            if (session) {
                // session.user.accessToken = res.data.accessToken;
                session.user = res.data;
            } else {
                signIn();
            }
        } catch (e) {
            console.log('useAxiosAuth: refreshToken', e);
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
                await refreshToken();
                prevRequest.headers['Authorization'] = `Bearer ${session?.user.accessToken}`;
                return axiosAuth(prevRequest);
            }
            return Promise.reject(error);
        }
    );
    // useEffect(() => {
    //     console.log('useAxiosAuth: useEffect', session);

        // const requestIntercept = axiosAuth.interceptors.request.use(
        //     (config) => {
        //         if (!config.headers['Authorization']) {
        //             config.headers['Authorization'] = `Bearer ${session?.user?.accessToken}`;
        //         }
        //         return config;
        //     },
        //     (error) => Promise.reject(error)
        // );
        //
        // const responseIntercept = axiosAuth.interceptors.response.use(
        //     (response) => response,
        //     async (error) => {
        //         const prevRequest = error?.config;
        //         if (error?.response?.status === 401 && !prevRequest?.sent) {
        //             prevRequest.sent = true;
        //             await refreshToken();
        //             prevRequest.headers['Authorization'] = `Bearer ${session?.user.accessToken}`;
        //             return axiosAuth(prevRequest);
        //         }
        //         return Promise.reject(error);
        //     }
        // );

        // return () => {
        //     axiosAuth.interceptors.request.eject(requestIntercept);
        //     axiosAuth.interceptors.response.eject(responseIntercept);
        // };
    // }, [session, refreshToken]);

    return axiosAuth;
};

export default useAxiosAuth;
