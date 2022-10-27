import * as yup from "yup";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getFullName, getOption, noOwnerOption } from "../../utils";
import type { Values, InitValues, InitValuesParams } from "./types";

const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
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

const getInitValues = (
    initValues?: InitValues,
    {
        owners = [],
        lifecycleStages = [],
    }: InitValuesParams = {}
): Values => {
    const owner = owners?.find(({ id }) => id === initValues?.ownerId);
    const lifecycleStage = lifecycleStages?.find(({ id }) => id === initValues?.lifecycleStage);

    return ({
        email: get(initValues, ["email"], ""),
        firstName: get(initValues, ["firstName"], ""),
        lastName: get(initValues, ["lastName"], ""),
        owner: !owner ? noOwnerOption : getOption(owner.id, getFullName(owner)),
        jobTitle: get(initValues, ["jobTitle"], ""),
        phone: get(initValues, ["phone"], ""),
        lifecycleStage: !lifecycleStage ? getOption("", "") : getOption(lifecycleStage.id, lifecycleStage.label),
        leadStatus: getOption("", ""),
    });
};

const getContactValues = (values: Values) => ({
    ...(isEmpty(values.email) ? {} : { email: values.email }),
    ...(isEmpty(values.firstName) ? {} : { firstname: values.firstName }),
    ...(isEmpty(values.lastName) ? {} : { lastname: values.lastName }),
    ...(isEmpty(values.jobTitle) ? {} : { jobtitle: values.jobTitle }),
    ...(isEmpty(values.phone) ? {} : { phone: values.phone }),
    ...(isEmpty(values.lifecycleStage.value) ? {} : { lifecyclestage: values.lifecycleStage.value }),
    ...(isEmpty(values.leadStatus?.value) ? {} : { hs_lead_status: values.leadStatus.value }),
    hubspot_owner_id: values.owner.value,
});

export {
    getInitValues,
    validationSchema,
    getContactValues,
};
