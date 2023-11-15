export interface IPageProps<P = Record<string, string>, SP = Record<string, string>> {
    params: P;
    searchParams: SP;
}

export interface IAction<T extends string = string> {
    type: T;
    payload?: any;
}
