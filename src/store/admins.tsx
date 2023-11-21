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
const AdminsActions = { ADD: 'ADD', UPDATE: 'UPDATE' } as const;

type TInitialState = typeof initialState;
type TAction = TActionType<typeof AdminsActions, typeof __HYDRATE__>;

const reducer: TReducer<TInitialState, TAction> = (state, { payload, type }) => {
    console.log('Admins: reducer', {
        payload, type, state
    });
    switch (type) {
        case __HYDRATE__:
            return {
                ...state,
                ...payload,
                _hydrated: true
            };
        case AdminsActions.ADD:
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
        case AdminsActions.UPDATE:
            return {
                ...state,
                data: { ...payload!.data! }
            };
        default:
            return state;
    }
};

const {
    Provider: AdminsProvider,
    useState: getAdminsState,
} = createStore<TInitialState, TAction>(initialState, reducer);
const useAdminsDispatch = getAdminsState('dispatch');

export {
    AdminsProvider,
    AdminsActions,
    getAdminsState,
    useAdminsDispatch
};
