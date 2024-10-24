const flatten = <T = unknown>(array: T[][]): T[] => {
    return array.reduce((acc, val) => acc.concat(val), []);
};

export { flatten };
