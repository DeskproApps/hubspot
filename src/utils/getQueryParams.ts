const getQueryParams = (params: Record<string, string|number|boolean>, encode?: boolean): string => {
    return Object.keys(params)
        .map((key) => encode
            ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
            : `${key}=${params[key]}`)
        .join('&');
};

export { getQueryParams };
