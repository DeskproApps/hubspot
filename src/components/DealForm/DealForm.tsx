import { FC, useState } from "react";
import { useFormik } from "formik";
import { HorizontalDivider, Stack } from "@deskpro/app-sdk";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { useStageOptions, usePipelineOptions } from "./hooks";
import { getInitValues, validationSchema } from "./utils";
import {
    Label,
    Title,
    Button,
    DateField,
    SingleSelect,
    BaseContainer,
} from "../common";
import { AmountField } from "./fields";
import type { Pipeline, PipelineStage } from "../../services/hubspot/types";
import type { Props, Values } from "./types";
import type { Option } from "../../types";

const DealForm: FC<Props> = ({
    onSubmit,
    onCancel,
    currency,
    pipelines,
    isEditMode,
    initValues,
    ownerOptions,
    dealTypeOptions,
    priorityOptions,
    contactOptions = [],
    companyOptions = [],
 }) => {
    const [pipelineOptions, setPipelineOptions] = useState<Array<Option<Pipeline["id"]>>>([]);
    const [stageOptions, setStageOptions] = useState<Array<Option<PipelineStage["id"]>>>([]);
    const {
        values,
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        getFieldProps,
    } = useFormik<Values>({
        initialValues: getInitValues(initValues, {
            pipelines,
            ownerOptions,
            contactOptions,
            companyOptions,
            dealTypeOptions,
            priorityOptions,
        }),
        validationSchema,
        onSubmit: async (values: Values) => {
            await onSubmit(values);
        },
    });

    usePipelineOptions(pipelines, setPipelineOptions);
    useStageOptions(values.pipeline.value, pipelines, setStageOptions);

    return (
        <form onSubmit={handleSubmit}>
            <BaseContainer>
                <Label htmlFor="name" label="Deal name" required>
                    <InputWithDisplay
                        id="name"
                        type="text"
                        inputsize="small"
                        placeholder="Enter value"
                        {...getFieldProps("name")}
                        error={!!(touched.name && errors.name)}
                    />
                </Label>

                <Label htmlFor="pipeline" label="Pipeline" required>
                    <SingleSelect
                        id="pipeline"
                        value={values.pipeline}
                        options={pipelineOptions}
                        error={!!(touched.pipeline && errors.pipeline)}
                        onChange={(value: Option<string>) => setFieldValue("pipeline", value)}
                    />
                </Label>

                <Label htmlFor="dealStage" label="Deal stage" required>
                    <SingleSelect
                        id="dealStage"
                        value={values.dealStage}
                        options={stageOptions}
                        error={!!(touched.dealStage && errors.dealStage)}
                        onChange={(value: Option<string>) => setFieldValue("dealStage", value)}
                    />
                </Label>

                <AmountField
                    currency={currency}
                    error={!!(touched.amount && errors.amount)}
                    {...getFieldProps("amount")}
                />

                <DateField
                    required
                    id="closeDate"
                    label="Close date"
                    error={!!(touched.closeDate && errors.closeDate)}
                    {...getFieldProps("closeDate")}
                    onChange={(date: [Date]) => setFieldValue("closeDate", date[0])}
                />

                <Label htmlFor="dealOwner" label="Deal owner">
                    <SingleSelect
                        id="dealOwner"
                        value={values.dealOwner}
                        options={ownerOptions}
                        error={!!(touched.dealOwner && errors.dealOwner)}
                        onChange={(value: Option<string>) => setFieldValue("dealOwner", value)}
                    />
                </Label>

                <Label htmlFor="dealType" label="Deal type">
                    <SingleSelect
                        id="dealType"
                        value={values.dealType}
                        options={dealTypeOptions}
                        error={!!(touched.dealType && errors.dealType)}
                        onChange={(value: Option<string>) => setFieldValue("dealType", value)}
                    />
                </Label>

                <Label htmlFor="priority" label="Priority">
                    <SingleSelect
                        id="priority"
                        value={values.priority}
                        options={priorityOptions}
                        error={!!(touched.priority && errors.priority)}
                        onChange={(value: Option<string>) => setFieldValue("priority", value)}
                    />
                </Label>
            </BaseContainer>

            {!isEditMode && <HorizontalDivider />}

            <BaseContainer>
                {!isEditMode && <Title title="Associate deal with" />}

                {!isEditMode && (
                    <Label htmlFor="contact" label="Contact">
                        <SingleSelect
                            id="contact"
                            value={values.contact}
                            options={contactOptions}
                            error={!!(touched.contact && errors.contact)}
                            onChange={(value: Option<string>) => setFieldValue("contact", value)}
                        />
                    </Label>
                )}

                {!isEditMode && (
                    <Label htmlFor="company" label="Company">
                        <SingleSelect
                            id="company"
                            value={values.company}
                            options={companyOptions}
                            error={!!(touched.company && errors.company)}
                            onChange={(value: Option<string>) => setFieldValue("company", value)}
                        />
                    </Label>
                )}

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
            </BaseContainer>
        </form>
    );
};

export { DealForm };
