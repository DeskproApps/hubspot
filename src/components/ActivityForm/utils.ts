import * as yup from "yup";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import { getOption, mdToHtml } from "../../utils";
import { parseDateTime } from "../../utils/date";
import type { Contact } from "../../services/hubspot/types";
import type { Values, InitValues, InitValuesParams } from "./types";
import type { Option } from "../../types";

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
        dealOptions = [],
        companyOptions = [],
        contactOptions = [],
    }: InitValuesParams = {},
): Values => {
    const contact = find(contactOptions, ["value", initValues?.contactId]);

    return {
        activityType: getOption<string>("call", "Call"),
        description: "",
        timestamp: new Date(),
        contacted: !contact
            ? getOption("", "")
            : getOption<Contact["id"]>(contact.value, contact.label),
        callDisposition: getOption("", ""),
        callDirection: getOption("", ""),
        associateContact: !contact ? [] : [contact.value],
        associateCompany: companyOptions?.map(({ value }) => value) || [],
        associateDeal: dealOptions?.map(({ value }) => value) || [],
    };
};

const getCallActivityValues = ({ contact }: { contact?: Option<string> }) => (values: Values): {
    hs_call_body?: string,
    hs_timestamp?: string,
    hs_call_disposition?: string,
    hs_call_direction?: string,
    hs_call_title?: string,
} => {
    const timestamp = parseDateTime(values.timestamp);

    return {
        ...(!values.description ? {} : { hs_call_body: mdToHtml(values.description) }),
        ...(!timestamp ? {} : { hs_timestamp: timestamp }),
        ...(!contact?.label ? {} : { hs_call_title: `Call with ${contact.label}` }),
        ...(isEmpty(values.callDisposition.value) ? {} : { hs_call_disposition: values.callDisposition.value}),
        ...(isEmpty(values.callDirection.value) ? {} : { hs_call_direction: values.callDirection.value }),
    };
};


const getEmailActivityValues = () => (values: Values): {
    hs_email_text?: string,
    hs_timestamp?: string,
    hs_email_direction: string,
} => {
    const timestamp = parseDateTime(values.timestamp);

    return {
        ...(!values.description ? {} : { hs_email_html: mdToHtml(values.description) }),
        ...(!timestamp ? {} : { hs_timestamp: timestamp }),
        hs_email_direction: "EMAIL",
    };
};

export { validationSchema, getInitValues, getCallActivityValues, getEmailActivityValues };
