type DataItem = {
    [key: string]: unknown;
};

type SourceItem = {
    data?: DataItem;
};

const normalize = (
    source: SourceItem[] | undefined,
    fieldName: string = "id",
): Record<string, DataItem> => {
    if (!Array.isArray(source)) {
        return {};
    }

    return source.reduce<Record<string, DataItem>>((acc, { data } = {}) => {
        if (data && data[fieldName]) {
            const key = String(data[fieldName]);
            acc[key] = data;
        }

        return acc;
    }, {});
};

export { normalize };
