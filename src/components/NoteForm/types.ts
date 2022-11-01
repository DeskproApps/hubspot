export type Values = {
    note: string,
    files: File[],
};

export type Props = {
    onSubmit: (values: Values) => void,
    onCancel: () => void,
};
