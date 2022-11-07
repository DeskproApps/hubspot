import * as yup from "yup";
import { getOption } from "../../utils";
import type { Contact } from "../../services/hubspot/types";
import type { Values, InitValues, InitValuesParams } from "./types";
import find from "lodash/find";

const validationSchema = yup.object().shape({
    activityType: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]),
    }),
    description: yup.string().required(),
    timestamp: yup.string().required(),
});

const getInitValues = (
    initValues?: InitValues,
    {
        contactOptions = [],
    }: InitValuesParams = {},
): Values => {
    const contact = find(contactOptions, ["value", initValues?.contactId]);

    return {
        activityType: getOption<string>("call", "Call"),
        description: "",
        timestamp: "",
        contacted: !contact
            ? getOption("", "")
            : getOption<Contact["id"]>(contact.value, contact.label),
        callDisposition: getOption("", ""),
        callDirection: getOption("", ""),
        associateContact: !contact
            ? getOption("", "")
            : getOption<Contact["id"]>(contact.value, contact.label),
        associateCompany: getOption("", ""),
        associateDeal: getOption("", ""),
    };
};

const getActivityValues = (values: Values): any => {

};

export { validationSchema, getInitValues, getActivityValues };
