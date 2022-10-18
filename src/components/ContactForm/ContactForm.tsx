import { FC, useState, useEffect } from "react";
import { useFormik } from "formik";
import concat from "lodash/concat";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { Stack } from "@deskpro/app-sdk";
import {
    Label,
    Button,
    SingleSelect,
} from "../common";
import {
    getOption,
    getInitValues,
    noOwnerOption,
    validationSchema,
} from "./utils";
import { getFullName } from "../../utils";
import type { Props, Values, Option } from "./types";

const ContactForm: FC<Props> = ({
    owners,
    onSubmit,
    onCancel,
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
        initialValues: getInitValues(),
        validationSchema,
        onSubmit: async (values: Values) => {
            await onSubmit(values);
        },
    });

    useEffect(() => {
        let options = [noOwnerOption];

        if (Array.isArray(owners) && owners.length > 0) {
            options = concat(
                options,
                owners.map((owner) => getOption(owner.id, getFullName(owner))),
            );
        }

        setOwnerOptions(options);
    }, [owners]);

    useEffect(() => {
        if (Array.isArray(lifecycleStages) && lifecycleStages.length > 0) {
            setStageOptions(
                lifecycleStages.map(({ id, label }) => getOption(id, label))
            );
        }
    }, [lifecycleStages]);

    useEffect(() => {
        if (Array.isArray(leadStatuses) && leadStatuses.length > 0) {
            setStatusOptions(leadStatuses.map(({ value, label }) => getOption(value, label)));
        }
    }, [leadStatuses]);

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="email" label="Email">
                <InputWithDisplay
                    type="text"
                    id="email"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("email")}
                    error={!!(touched.email && errors.email)}
                />
            </Label>

            <Label htmlFor="firstName" label="First name">
                <InputWithDisplay
                    type="text"
                    id="firstName"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("firstName")}
                    error={!!(touched.firstName && errors.firstName)}
                />
            </Label>

            <Label htmlFor="lastName" label="Last name">
                <InputWithDisplay
                    type="text"
                    id="lastName"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("lastName")}
                    error={!!(touched.lastName && errors.lastName)}
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
                    error={!!(touched.jobTitle && errors.jobTitle)}
                />
            </Label>

            <Label htmlFor="phone" label="Phone">
                <InputWithDisplay
                    type="text"
                    id="phone"
                    inputsize="small"
                    placeholder="Enter value"
                    {...getFieldProps("phone")}
                    error={!!(touched.phone && errors.phone)}
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

            <Label htmlFor="leadStatus" label="Lead status">
                <SingleSelect
                    id="leadStatus"
                    value={values.leadStatus}
                    options={statusOptions}
                    error={!!(touched.leadStatus && errors.leadStatus)}
                    onChange={(value: Option<string>) => setFieldValue("leadStatus", value)}
                />
            </Label>

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text={isEditMode ? "Save" : "Create"}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
                <Button
                    text="Cancel"
                    intent="tertiary"
                    onClick={onCancel}
                />
            </Stack>
        </form>
    );
};

export { ContactForm };
