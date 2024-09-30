// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (value: any): value is string => {
    return typeof value === "string";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumber = (value: any): value is number => {
    return typeof value === "number" && !isNaN(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPrimitive = (value: any): value is string | number => {
    return isString(value) || isNumber(value);
};

export const isEmptyObject = (obj: object): boolean => {
    return obj == null || (Object.keys(obj).length === 0 && obj.constructor === Object);
};
