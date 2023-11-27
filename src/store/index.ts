'use client';

import { Providers } from '@/constants';
import {
    AdminsActions, getAdminsState, useAdminsDispatch
} from '@/store/admins';
import { TProvider } from '@/store/types';
import {
    getUsersState, UsersActions, useUsersDispatch
} from '@/store/users';
import {
    getTransactionsState, TransactionsActions, useTransactionsDispatch
} from '@/store/transactions';
import {
    getOrderProcessState, OrderProcessActions, useOrderProcessDispatch
} from '@/store/orderProcess';


export const __HYDRATE__ = '__HYDRATE__';
export type TProviders = TProvider<typeof Providers>;

export const useProviderData = (data: any, provider?: TProviders) => {
    let state: any;
    switch (provider) {
        case Providers.admins:
            state = getAdminsState('state')({ data }).data;
            break;
        case Providers.users:
            state = getUsersState('state')({ data }).data;
            break;
        case Providers.transactions:
            state = getTransactionsState('state')({ data }).data;
            break;
        case Providers.orderProcess:
            state = getOrderProcessState('state')({ data }).data;
            break;
        default:
            state = data;
            break;
    }

    return state;
};

export const useProviderDispatch = (provider?: TProviders) => {
    const obj: {
        dispatch: any;
        actions: {ADD: 'ADD'; UPDATE: 'UPDATE'};
    } = {} as never;
    switch (provider) {
        case Providers.admins:
            obj.actions = AdminsActions;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            obj.dispatch = useAdminsDispatch();
            break;
        case Providers.users:
            obj.actions = UsersActions;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            obj.dispatch = useUsersDispatch();
            break;
        case Providers.transactions:
            obj.actions = TransactionsActions;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            obj.dispatch = useTransactionsDispatch();
            break;
        case Providers.orderProcess:
            obj.actions = OrderProcessActions;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            obj.dispatch = useOrderProcessDispatch();
            break;
        default:
            break;
    }

    return obj;
};
