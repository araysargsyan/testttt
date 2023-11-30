'use client';

import { __HYDRATE__ } from '@/store/index';
import createStore from '@/lib/createStore';
import {
    IStateSchema, TActionType, TReducer
} from '@/store/types';


const initialState: IStateSchema<{count: number; result: Record<string, any>[]}> = {
    _hydrated: false,
    data: {
        result: [],
        count: 0
    },
    error: ''
};
const TransactionsActions = {
    ADD: 'ADD', UPDATE: 'UPDATE'
} as const;

type TInitialState = typeof initialState;
type TAction = TActionType<typeof TransactionsActions, typeof __HYDRATE__>;

const reducer: TReducer<TInitialState, TAction> = (state, {
    payload, type
}) => {
    console.log('Transactions: reducer', {
        payload, type, state
    });
    switch (type) {
        case __HYDRATE__:
            return {
                ...state,
                ...payload,
                _hydrated: true
            };
        case TransactionsActions.ADD:
            return {
                ...state,
                data: {
                    count: state.data.count + 1,
                    result: [
                        ...state.data.result,
                        payload!.data!.result
                    ]
                },
            };
        case TransactionsActions.UPDATE:
            return {
                ...state,
                data: { ...payload!.data! }
            };
        default:
            return state;
    }
};

const {
    Provider: TransactionsProvider,
    useState: getTransactionsState,
} = createStore<TInitialState, TAction>(initialState, reducer);
const useTransactionsDispatch = getTransactionsState('dispatch');

export {
    TransactionsProvider,
    TransactionsActions,
    getTransactionsState,
    useTransactionsDispatch
};
