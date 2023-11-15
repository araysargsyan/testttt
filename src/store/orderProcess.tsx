'use client'

import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    type Dispatch,
    type FC,
    type ReactNode,
} from 'react';
import { useRouter } from 'next/router';


import { type IAction } from '@/types/core';
import {IOrderProcess} from "@/types/common";


export interface IOrderProcessState {
    data: IOrderProcess | null;
    error: string;
}
export interface IOrderProcessProviderProps {
    payload: Partial<IOrderProcessState>;
    children: ReactNode;
}
interface IOrderProcessContext {
    state: typeof initialState;
    dispatch: (actionType: EActions, payload?: any) => Promise<void> | void;
}

enum EActions {
    UPDATE = 'UPDATE',
}

const initialState = {
    data: null,
    error: ''
} as IOrderProcessState;

const reducer = (state: IOrderProcessState, { payload, type }: IAction<keyof typeof EActions>) => {
    switch (type) {
        case EActions.UPDATE:
            console.log('reducer', {payload, type, state})

            return {
                ...state,
                data: {...payload}
            };
        default:
            return state;
    }
};


const update = async (dispatch: Dispatch<IAction<keyof typeof EActions>>, data: IOrderProcess) => {
    console.log('update', {data})
    // const payload = await authService.signIn(data);
    data && dispatch({ type: EActions.UPDATE, payload: data });
};

const OrderProcessContext = createContext<IOrderProcessContext | null>(null);

const OrderProcessProvider: FC<IOrderProcessProviderProps> = ({ payload, children }) => {
    const [ state, dispatcher ] = useReducer(reducer, (payload || initialState) as never);
    // const { push } = useRouter();

    useEffect(() => {
        console.log('RENDER: OrderProcessProvider');
    });

    const store = {
        state,
        dispatch: async (actionType, payload?) => {
            switch (actionType) {
                case EActions.UPDATE:
                    console.log('OrderProcessProvider:reducer', {payload, actionType, state})
                    await update(dispatcher, payload);
                    // await sleep(2000)
                    // await push(ERoutes.HOME);
                    break;
                default:
                    dispatcher({ type: actionType, payload });
            }
        },
    } as IOrderProcessContext;

    return (
        <OrderProcessContext.Provider value={ store }>
            { children }
        </OrderProcessContext.Provider>
    );
};

const useOrderProcessData = () => useContext(OrderProcessContext) as IOrderProcessContext;
const orderProcessActions = EActions;

export {
    OrderProcessProvider, useOrderProcessData, orderProcessActions,
};
