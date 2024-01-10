'use client';

import {
    createContext,
    useContext,
    useReducer,
    type Dispatch,
    type FC,
    type ReactNode,
    type Reducer,
} from 'react';


import {
    IActionWithPayload, IStateSchema, TActionType
} from '@/store/types';
import { IOrderProcess } from '@/types/common';


const SingleOrderProcessActions = { UPDATE: 'UPDATE' } as const;
type TAction = TActionType<typeof SingleOrderProcessActions>;
const initialState: IStateSchema<IOrderProcess> = {
    data: null as never,
    error: ''
};
type TInitialState = typeof initialState;
export interface ISingleOrderProcessProviderProps {
    payload?: TInitialState;
    children: ReactNode;
}
interface ISingleOrderProcessContext {
    state: typeof initialState;
    dispatch: (actionType: TAction, payload?: any) => Promise<void> | void;
}

const reducer: Reducer<TInitialState, IActionWithPayload<TAction>> = (state, {
    payload, type
}) => {
    switch (type) {
        case SingleOrderProcessActions.UPDATE:
            // console.log('SingleOrderProcess: reducer', {
            //     payload, type, state
            // });
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload
                }
            };
        default:
            return state;
    }
};


const update = async (dispatch: Dispatch<any>, data: IOrderProcess) => {
    // console.log('update', { data });
    // const payload = await authService.signIn(data);
    data && dispatch({
        type: SingleOrderProcessActions.UPDATE, payload: data
    });
};

const SingleOrderProcessContext = createContext<ISingleOrderProcessContext | null>(null);

const SingleOrderProcessProvider: FC<ISingleOrderProcessProviderProps> = ({
    payload, children
}) => {
    const [ state, dispatcher ] = useReducer(reducer, (payload || initialState) as never);

    const store = {
        state,
        dispatch: async (actionType, payload?) => {
            switch (actionType) {
                case SingleOrderProcessActions.UPDATE:
                    // console.log('SingleOrderProcessProvider:reducer', {
                    //     payload, actionType, state
                    // });
                    await update(dispatcher, payload);
                    // await sleep(2000)
                    // await push(ERoutes.HOME);
                    break;
                default:
                    dispatcher({
                        type: actionType, payload
                    });
            }
        },
    } as ISingleOrderProcessContext;

    return (
        <SingleOrderProcessContext.Provider value={ store }>
            { children }
        </SingleOrderProcessContext.Provider>
    );
};

const useSingleOrderProcessData = () => useContext(SingleOrderProcessContext) as ISingleOrderProcessContext;

export {
    SingleOrderProcessProvider, useSingleOrderProcessData, SingleOrderProcessActions,
};
