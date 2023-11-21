'use client';

import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    type Dispatch,
    type FC,
    type ReactNode, Reducer,
} from 'react';


import { IOrderProcess } from '@/types/common';
import {
    IActionWithPayload, IStateSchema, TActionType
} from '@/store/types';


const OrderProcessActions = { UPDATE: 'UPDATE' } as const;
type TAction = TActionType<typeof OrderProcessActions>;
const initialState: IStateSchema<IOrderProcess | null> = {
    data: null,
    error: ''
};
type TInitialState = typeof initialState;
export interface IOrderProcessProviderProps {
    payload?: TInitialState;
    children: ReactNode;
}
interface IOrderProcessContext {
    state: typeof initialState;
    dispatch: (actionType: TAction, payload?: any) => Promise<void> | void;
}

const reducer: Reducer<TInitialState, IActionWithPayload<TAction>> = (state, { payload, type }) => {
    switch (type) {
        case OrderProcessActions.UPDATE:
            console.log('reducer', {
                payload, type, state
            });

            return {
                ...state,
                data: { ...payload }
            };
        default:
            return state;
    }
};


const update = async (dispatch: Dispatch<any>, data: IOrderProcess) => {
    console.log('update', { data });
    // const payload = await authService.signIn(data);
    data && dispatch({ type: OrderProcessActions.UPDATE, payload: data });
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
                case OrderProcessActions.UPDATE:
                    console.log('OrderProcessProvider:reducer', {
                        payload, actionType, state
                    });
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

export {
    OrderProcessProvider, useOrderProcessData, OrderProcessActions,
};
