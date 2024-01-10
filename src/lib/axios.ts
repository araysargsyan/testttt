import axios, {
    AxiosError, AxiosInstance,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from 'axios';
import { getSession } from 'next-auth/react';
import { MutableRefObject } from 'react';
import {
    Session, User
} from 'next-auth';

import { EAuthCookie } from '@/types/common';
import setAccessToken from '@/lib/util/setAccessToken';
import logout from '@/lib/util/logout';


const BaseConfig: CreateAxiosDefaults = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
};

const axiosWithoutInterceptors = axios.create(BaseConfig);
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: AxiosError) => void;
}> = [];
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const refreshToken = async () => {
    try {
        console.log('refreshToken: start');
        const session = await getSession();
        const res = await axiosWithoutInterceptors.get<{
            [EAuthCookie.ACCESS]: EAuthCookie.ACCESS;
        }>(
            '/auth/refresh-access',
            { headers: { Authorization: `Bearer ${session?.user[EAuthCookie.REFRESH]}` } }
        );
        if (res.status === 201) {
            setAccessToken(res.data[EAuthCookie.ACCESS]);
            return res.data[EAuthCookie.ACCESS];
        } else {
            // signIn();
            logout();
        }
    } catch (e) {
        console.log('refreshToken: ERROR', e);
        logout();
    } finally {
        isRefreshing = false;
    }
};

const authRequestInterceptor = (request: InternalAxiosRequestConfig) => {
    request.headers.authorization = `Bearer ${localStorage.getItem(EAuthCookie.ACCESS)}`;
    return request;
};

const authResponseErrorInterceptor = async (error: any) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({
                    resolve, reject
                });
            }).then(token => {
                prevRequest.headers['Authorization'] = 'Bearer ' + token;
                return axios(prevRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        prevRequest.sent = true;
        isRefreshing = true;

        const newAccessToken = await refreshToken();
        if (newAccessToken) {
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return axiosAuth(prevRequest).then((res) => {
                axiosAuth.updateSession?.current?.({ [EAuthCookie.ACCESS]: newAccessToken });
                res.newAccessToken = newAccessToken;
                return res;
            });
        }
    }
    return Promise.reject(error);
};

const axiosAuth = axios.create(BaseConfig) as AxiosInstance & {
    updateSession?: MutableRefObject<((data: Partial<User>) => void) | null>;
};

axiosAuth.interceptors.request.use(
    authRequestInterceptor,
    (error) => Promise.reject(error)
);
axiosAuth.interceptors.response.use(
    (response) => response,
    authResponseErrorInterceptor
);

export default axiosAuth;


