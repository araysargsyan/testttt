import {
    Context,
    FC,
    PropsWithChildren,
    Reducer,
    ReducerAction,
    ReducerState,
    MutableRefObject,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    useLayoutEffect,
    useRef,
} from 'react';

import { __HYDRATE__ } from '@/store';
import { IActionWithPayload } from '@/store/types';
import { DeepPartial } from '@/types/next';


interface IStoreProviderContext<S = Record<string, any>, A extends string = string> {
    state: S;
    dispatch: (type: A, payload?: DeepPartial<S>) => void;
}

const createStore = <
    S extends Record<string, any>
        = Record<string, any>,
    A extends Exclude<string, typeof __HYDRATE__>
        = Exclude<string, typeof __HYDRATE__>,
    R extends Reducer<S, IActionWithPayload<A, Partial<S>>>
        = Reducer<S, IActionWithPayload<A, Partial<S>>>,
    T extends IStoreProviderContext<ReducerState<R>, A | typeof __HYDRATE__>
        = IStoreProviderContext<ReducerState<R>, A | typeof __HYDRATE__>,
>(initialState: ReducerState<R>, reducer: R) => {
    const StateContext = createContext<T['state'] | null>(null) as Context<T['state']>;
    const DispatchContext = createContext<T['dispatch'] | null>(null) as Context<T['dispatch']>;
    const context = {
        StateContext,
        DispatchContext
    };

    const Provider: FC<PropsWithChildren<{
        defaultState?: ReducerState<R>;
    }>> = ({
        defaultState, children 
    }) => {
        const [ state, dispatcher ] = useReducer<R>(reducer, defaultState || initialState);

        const dispatch = useCallback((actionType: A, payload?: ReducerState<R>) => {
            return dispatcher({
                type: actionType, payload 
            } as ReducerAction<R>);
        }, []);

        const store = useMemo(() => ({
            state,
            dispatch
        } as T), [ state, dispatch ]);

        return (
            <StateContext.Provider value={ store.state }>
                <DispatchContext.Provider value={ store.dispatch }>
                    { children }
                </DispatchContext.Provider>
            </StateContext.Provider>
        );
    };

    const hydrate = (
        state: T['state'],
        shouldHydrate: MutableRefObject<boolean>,
        payload?: DeepPartial<T['state']>,
    ) => {
        if (payload && !state?._hydrated) {
            shouldHydrate.current = true;
            return {
                ...state,
                ...payload,
            } as T['state'];
        } else {
            return null;
        }
    };


    const useState = <
        ALL extends 'all' | 'single' = 'single',
        TYPE extends 'state' | 'dispatch' = 'state' | 'dispatch',
    >(type: TYPE = 'all' as TYPE) => (data?: DeepPartial<T['state']>): (
        ALL extends 'all' ? {
            state: T['state'];
            dispatch: T['dispatch'];
        } : TYPE extends 'state'
            ? T['state']
            : T['dispatch']
        ) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const shouldHydrate = useRef(false);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const dispatch = useContext<T['dispatch']>(context.DispatchContext);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useLayoutEffect(() => {
                if (shouldHydrate.current) {
                    console.log(__HYDRATE__, data);
                    dispatch(__HYDRATE__, data);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);

            if (type === 'state') {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const state = useContext(context.StateContext);
                const result = hydrate(state, shouldHydrate, data) as T['state'];

                if (result === null) {
                    return state as never;
                }

                return result as never;
            } else if (type === 'dispatch') {
                return dispatch as never;
            } else {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const state = useContext(context.StateContext);
                const result = hydrate(state, shouldHydrate, data);

                return {
                    state: result,
                    dispatch
                } as never;
            }
        };

    return {
        Provider,
        context,
        useState,
    };
};

export default createStore;
