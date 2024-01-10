
export default function getSearchParams(params: Record<string, string>, defaultUrlParams?: string) {
    const urlParams = new URLSearchParams(defaultUrlParams);
    Object.keys(params).forEach((name) => {
        urlParams.set(name, params[name]);
    });

    return urlParams;
}

URLSearchParams.prototype.toObject = function() {
    const result: Record<string, string> = {};

    this.forEach((value, key) => {
        result[key] = value;
    });

    return result;
};
