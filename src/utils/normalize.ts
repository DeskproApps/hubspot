// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalize = (source: undefined|any[], fieldName = "id") => {
    if (!Array.isArray(source)) {
        return {};
    }

    return source.reduce((acc, { data } = {}) => {
        if (data && data[fieldName]) {
            const key = data[fieldName];
            acc[key] = data;
        }

        return acc;
    }, {});
};

export { normalize };
