import * as yup from "yup";
import { getOption } from "../../utils";
import type { Values, InitValues, InitValuesParams } from "./types";

const validationSchema = yup.object().shape({
    name: yup.string().required(),
    pipeline: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }).required(),
    dealStage: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }).required(),
    amount: yup.string(),
    closeDate: yup.string(),
    dealOwner: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    dealType: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    priority: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    contact: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    company: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
});

const getInitValues = (
    initValues?: InitValues,
    {}: InitValuesParams = {},
): Values => {
    return {
        name: "",
        pipeline: getOption<string>("", ""),
        dealStage: getOption<string>("", ""),
        amount: "",
        closeDate: "",
        dealOwner: getOption<string>("", ""),
        dealType: getOption<string>("", ""),
        priority: getOption<string>("", ""),
        contact: getOption<string>("", ""),
        company: getOption<string>("", ""),
    };
};

export { getInitValues, validationSchema };
