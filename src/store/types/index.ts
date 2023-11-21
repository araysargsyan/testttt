import { Reducer } from 'react';


export type TProvider<T extends Record<string, string>> = T[keyof T];
export interface IStateSchema<T = any> {
    _hydrated?: boolean;
    data: T;
    error: string;
}

export interface IActionWithPayload<T extends string = string, P = any> {
    type: T;
    payload?: P;
}

export type TReducer<S extends IStateSchema = IStateSchema, A extends string = string> = Reducer<S, IActionWithPayload<A, Partial<S>>>;

export type TActionType<
    T extends Record<string, string> = Record<string, string>,
    HYDRATE extends string | false = false,
    VALUES extends string = T[keyof T],
> = HYDRATE extends false ? VALUES : VALUES | HYDRATE;
