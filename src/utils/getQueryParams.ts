// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getQueryParams = (params: Record<string, any>, encode?: boolean): string => {
    return Object.keys(params)
        .map((key) => encode
            ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
            : `${key}=${params[key]}`)
        .join('&');
};

export { getQueryParams };
