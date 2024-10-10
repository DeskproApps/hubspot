const flatten = (array: string[][]): string[] => {
    return array.reduce((acc, val) => acc.concat(val), []);
};

export { flatten };
