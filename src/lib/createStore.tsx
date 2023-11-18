import {
    createContext, FC, PropsWithChildren, Reducer, useCallback, useMemo, useReducer
} from 'react';


interface IStoreProviderContext<T extends string = string> {
    state: Record<string, any>;
    dispatch: (type: any, payload: any) => void;
}

const createStore = <
    S = Record<string, any>,
    T extends IStoreProviderContext = IStoreProviderContext
>(initialState: S, reducer: Reducer<S, {
    type: Parameters<IStoreProviderContext['dispatch']>[0];
    payload: Parameters<IStoreProviderContext['dispatch']>[1];
}>) => {
    const StateContext = createContext<T['state'] | null>(null);
    const DispatchContext = createContext<T['dispatch'] | null>(null);

    const Provider: FC<PropsWithChildren<{defaultState?: S}>> = ({ defaultState, children }) => {
        const [ state, dispatcher ] = useReducer(reducer, defaultState || initialState);

        const dispatch = useCallback<T['dispatch']>((actionType, payload?) => {
            return dispatcher({ type: actionType, payload });
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

    return {
        Provider,
        context: {
            StateContext,
            DispatchContext
        }
    };
};

export default createStore;
