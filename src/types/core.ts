export interface IPageProps<P = Record<string, string>, SP = Record<string, string>> {
    params: P;
    searchParams: SP;
}
