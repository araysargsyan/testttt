export default function getSearchParams(params: Record<string, string>) {
    const urlParams = new URLSearchParams();
    Object.keys(params).forEach((name) => {
        urlParams.set(name, params[name]);
    });

    return urlParams;
}
