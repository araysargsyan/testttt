'use client';

import {
    useContext,
    Reducer,
} from 'react';


import { __HYDRATE__ } from '@/store/index';
import createStore from '@/lib/createStore';
import {
    IActionWithPayload, IStateSchema, TActionType
} from '@/store/types';


const initialState: IStateSchema<any[]> = {
    _hydrated: false,
    data: [],
    error: ''
};
type TInitialState = typeof initialState;
const AdminsActions = { ADD: 'ADD' } as const;
type TAction = TActionType<typeof AdminsActions, true>;
interface IAdminsContext {
    state: typeof initialState;
    dispatch: (actionType: TAction, payload?: any) => /*Promise<void> |*/ void;
}

const reducer: Reducer<TInitialState, IActionWithPayload<TAction>> = (state, { payload, type }) => {
    console.log('reducer', {
        payload, type, state
    });
    switch (type) {
        case __HYDRATE__:
            return {
                ...state,
                data: [ ...payload ],
                _hydrated: true
            };
        case AdminsActions.ADD:
            return {
                ...state,
                data: [ ...state.data, payload ]
            };
        default:
            return state;
    }
};


const { context, Provider: AdminsProvider } = createStore(initialState, reducer);

const useAdminsDispatch = () => {
    return useContext(context.DispatchContext) as IAdminsContext['dispatch'];
};

const useAdminsState = (data?: any) => {
    const state = useContext(context.StateContext) as IAdminsContext['state'];
    const dispatch = useContext(context.DispatchContext) as IAdminsContext['dispatch'];

    if (data && !state?._hydrated) {
        dispatch(__HYDRATE__, data);

        return {
            ...state,
            data: [ ...data ]
        };
    }

    return state;
};

export {
    AdminsProvider,
    AdminsActions,
    useAdminsState,
    useAdminsDispatch,
};
