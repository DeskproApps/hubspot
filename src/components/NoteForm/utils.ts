import * as yup from "yup";
import isEmpty from "lodash/isEmpty";
import { parseDateTime } from "../../utils/date";
import type { Values } from "./types";

const validationSchema = yup.object().shape({
    note: yup.string().required(),
});

const getInitValues = (): Values => ({
    note: "",
    // files: [],
});

const getNoteValues = (values: Values) => {
    return ({
        ...(isEmpty(values.note) ? {} : { hs_note_body: values.note }),
        hs_timestamp: parseDateTime(new Date()) as string,
    });
}

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
