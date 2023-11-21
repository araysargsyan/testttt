'use client';

import { getAdminsState } from '@/store/admins';
import { TProvider } from '@/store/types';


export const __HYDRATE__ = '__HYDRATE__';
const Providers = { admins: 'admins' } as const;
export type TProviders = TProvider<typeof Providers>;

export const useProviderData = (data: any, provider?: TProviders) => {
    let state: any;
    switch (provider) {
        case Providers.admins:
            state = getAdminsState('state')({ data }).data;
            break;
        default:
            state = data;
            break;
    }

    return state;
};
