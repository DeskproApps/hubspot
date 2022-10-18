import * as yup from "yup";
import { Values, Option } from "./types";
import isEmpty from "lodash/isEmpty";

const validationSchema = yup.object().shape({
    email: yup.string().email(),
    firstName: yup.string(),
    lastName: yup.string(),
    owner: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    jobTitle: yup.string(),
    phone: yup.string(),
    lifecycleStage: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
    leadStatus: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string(),
        type: yup.string().oneOf(["value"]),
    }),
});

const getOption = <Value, >(
    value: Value,
    label: string,
): Option<Value> => ({
    label,
    value,
    key: value,
    type: "value",
});

const noOwnerOption = getOption("none", "No owner");

const getInitValues = (): Values => ({
    email: "",
    firstName: "",
    lastName: "",
    owner: { ...noOwnerOption, selected: true },
    jobTitle: "",
    phone: "",
    lifecycleStage: getOption("", ""),
    leadStatus: getOption("", ""),
});

const getContactValues = (values: Values) => ({
    ...(isEmpty(values.email) ? {} : { email: values.email }),
    ...(isEmpty(values.firstName) ? {} : { firstname: values.firstName }),
    ...(isEmpty(values.lastName) ? {} : { lastname: values.lastName }),
    ...(isEmpty(values.jobTitle) ? {} : { jobtitle: values.jobTitle }),
    ...(isEmpty(values.phone) ? {} : { phone: values.phone }),
    ...((values.owner.value === noOwnerOption.value) ? {} : { hubspot_owner_id: values.owner.value }),
    ...(isEmpty(values.lifecycleStage.value) ? {} : { lifecyclestage: values.lifecycleStage.value }),
    ...(isEmpty(values.leadStatus.value) ? {} : { hs_lead_status: values.leadStatus.value }),
});

export {
    getOption,
    getInitValues,
    noOwnerOption,
    validationSchema,
    getContactValues,
};
