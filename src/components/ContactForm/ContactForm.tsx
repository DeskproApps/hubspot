import { FC, useState } from "react";
import { useFormik } from "formik";
import get from "lodash/get";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { Stack } from "@deskpro/app-sdk";
import {
    Label,
    Button,
    ErrorBlock,
    SingleSelect,
} from "../common";
import {
    getInitValues,
    validationSchema,
} from "./utils";
import {
    useOwnerOptions,
    useLeadStatusOptions,
    useLifecycleStageOptions,
} from "./hooks";
import type { Props, Values, Option } from "./types";

const ContactForm: FC<Props> = ({
    owners,
    onSubmit,
    onCancel,
    initValues,
    formErrors = {},
    isEditMode = false,
    lifecycleStages,
    leadStatuses,
}) => {
    const [ownerOptions, setOwnerOptions] = useState<Array<Option<string>>>([]);
    const [stageOptions, setStageOptions] = useState<Array<Option<string>>>([]);
    const [statusOptions, setStatusOptions] = useState<Array<Option<string>>>([]);

    const {
        values,
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        getFieldProps,
    } = useFormik<Values>({
        initialValues: getInitValues(initValues, { owners, lifecycleStages }),
        validationSchema,
        onSubmit: async (values: Values) => {
            await onSubmit(values);
        },
    });

    useOwnerOptions(owners, setOwnerOptions);
    useLifecycleStageOptions(lifecycleStages, setStageOptions);
    useLeadStatusOptions(leadStatuses, setStatusOptions);

    return (
        <form onSubmit={handleSubmit}>
            {formErrors && <ErrorBlock text={Object.values(formErrors)} />}

            <Label htmlFor="email" label="Email" required>
                <InputWithDisplay
                    type="text"
                    id="email"
                    inputsize="small"
                    placeholder="Enter value"
                    disabled={Boolean(isEditMode)}
                    {...getFieldProps("email")}
                    error={!!(touched.email && errors.email) || Boolean(get(formErrors, ["email"], false))}
                />
            </Label>

            <Label htmlFor="firstName" label="First name">
                <InputWithDisplay
                    type="text"
                    id="firstName"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("firstName")}
                    error={!!(touched.firstName && errors.firstName) || Boolean(get(formErrors, ["firstName"], false))}
                />
            </Label>

            <Label htmlFor="lastName" label="Last name">
                <InputWithDisplay
                    type="text"
                    id="lastName"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("lastName")}
                    error={!!(touched.lastName && errors.lastName) || Boolean(get(formErrors, ["lastName"], false))}
                />
            </Label>

            <Label htmlFor="owner" label="Contact owner">
                <SingleSelect
                    id="owner"
                    value={values.owner}
                    options={ownerOptions}
                    error={!!(touched.owner && errors.owner)}
                    onChange={(value: Option<string>) => setFieldValue("owner", value)}
                />
            </Label>

            <Label htmlFor="jobTitle" label="Job title">
                <InputWithDisplay
                    type="text"
                    id="jobTitle"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("jobTitle")}
                    error={!!(touched.jobTitle && errors.jobTitle) || Boolean(get(formErrors, ["jobTitle"], false))}
                />
            </Label>

            <Label htmlFor="phone" label="Phone">
                <InputWithDisplay
                    type="text"
                    id="phone"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("phone")}
                    error={!!(touched.phone && errors.phone) || Boolean(get(formErrors, ["phone"], false))}
                />
            </Label>

            <Label htmlFor="lifecycleStage" label="Lifecycle stage">
                <SingleSelect
                    id="lifecycleStage"
                    value={values.lifecycleStage}
                    options={stageOptions}
                    error={!!(touched.lifecycleStage && errors.lifecycleStage)}
                    onChange={(value: Option<string>) => setFieldValue("lifecycleStage", value)}
                />
            </Label>

            {!isEditMode && <Label htmlFor="leadStatus" label="Lead status">
                <SingleSelect
                    id="leadStatus"
                    value={values.leadStatus}
                    options={statusOptions}
                    error={!!(touched.leadStatus && errors.leadStatus)}
                    onChange={(value: Option<string>) => setFieldValue("leadStatus", value)}
                />
            </Label>}

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text={isEditMode ? "Save" : "Create"}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
                {isEditMode && <Button
                    text="Cancel"
                    intent="tertiary"
                    onClick={() => { onCancel && onCancel() }}
                />}
            </Stack>
        </form>
    );
};

export { ContactForm };
