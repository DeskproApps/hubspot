const normalize = <T extends { id: string }>(
    source: Array<{ data?: T }> | undefined,
    fieldName: keyof T = "id",
): Record<string, T> => {
    if (!Array.isArray(source)) {
        return {};
    }

    return source.reduce<Record<string, T>>((acc, { data } = {}) => {
        if (data && data[fieldName]) {
            const key = String(data[fieldName]);
            acc[key] = data;
        }

        return acc;
    }, {});
};

export { normalize };
