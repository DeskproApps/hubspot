import * as yup from "yup";
import isEmpty from "lodash/isEmpty";
import type { Values } from "./types";

const validationSchema = yup.object().shape({
    note: yup.string(),
});

const getInitValues = (): Values => ({
    note: "",
    files: [],
});

const getNoteValues = () => {

};

const isEmptyForm = (values: Values): boolean => {
    return (Object.keys(values) as Array<keyof Values>).every((key) => {
        return isEmpty(values[key]);
    });
};

export {
    isEmptyForm,
    getNoteValues,
    getInitValues,
    validationSchema,
};
