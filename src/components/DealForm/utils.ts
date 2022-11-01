import * as yup from "yup";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";
import { getOption, noOwnerOption } from "../../utils";
import { parseDateTime } from "../../utils/date";
import type { Pipeline } from "../../services/hubspot/types";
import type { Values, InitValues, InitValuesParams } from "./types";

const validationSchema = yup.object().shape({
    name: yup.string().required(),
    pipeline: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]),
    }),
    dealStage: yup.object().shape({
        key: yup.string(),
        label: yup.string(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]),
    }),
    amount: yup.number(),
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
    {
        pipelines = [],
        ownerOptions = [],
        contactOptions = [],
        companyOptions = [],
        dealTypeOptions = [],
        priorityOptions = [],
    }: InitValuesParams = {},
): Values => {
    const contact = find(contactOptions, ["value", initValues?.contactId]);
    const company = find(companyOptions, ["value", initValues?.companyId]);
    const sortedPipelines = (pipelines.length <= 1)
        ? cloneDeep<Pipeline[]>(pipelines)
        : sortBy<Pipeline>(pipelines, ["displayOrder"]);
    const pipeline = get(sortedPipelines, [0]);
    const stage = get(sortedPipelines, [0, "stages", 0]);
    const owner = ownerOptions?.find(({ value }) => value === initValues?.ownerId);
    const dealType = dealTypeOptions?.find(({ value }) => value === initValues?.dealTypeId);
    const priority = priorityOptions?.find(({ value }) => value === initValues?.priorityId);

    return {
        name: get(initValues, ["name"], "") || "",
        pipeline: getOption<string>(pipeline.id, pipeline.label),
        dealStage: getOption<string>(stage.id, stage.label),
        amount: get(initValues, ["amount"], "") || "",
        closeDate: !initValues?.closeDate ? "" : new Date(initValues.closeDate),
        dealOwner: !owner ? noOwnerOption : getOption(owner.value, owner.label),
        dealType: !dealType ? getOption<string>("", "") : getOption(dealType.value, dealType.label),
        priority: ! priority ? getOption<string>("", "") : getOption(priority.value, priority.label),
        contact: !contact ? getOption<string>("", "") : getOption(contact.value, contact.label),
        company: !company ? getOption<string>("", "") : getOption(company.value, company.label),
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDealValues = (values: Omit<Values, "contact"|"company">): any => ({
    dealname: values.name,
    amount: values.amount,
    hubspot_owner_id: values.dealOwner.value,
    closedate: parseDateTime(values.closeDate),
    ...(isEmpty(values.pipeline) ? {} : { pipeline: values.pipeline.value }),
    ...(isEmpty(values.dealStage) ? {} : { dealstage: values.dealStage.value }),
    ...(isEmpty(values.dealType.value) ? {} : { dealtype: values.dealType.value }),
    ...(isEmpty(values.priority.value) ? {} : { hs_priority: values.priority.value }),
});

export { getInitValues, validationSchema, getDealValues };
