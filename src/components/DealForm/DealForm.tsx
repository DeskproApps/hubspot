import { FC, useState } from "react";
import { useFormik } from "formik";
import get from "lodash/get";
import {HorizontalDivider, Stack} from "@deskpro/app-sdk";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import {
    Label,
    Title,
    Button,
    SingleSelect,
    BaseContainer,
} from "../common";
import { getInitValues, validationSchema } from "./utils";
import type { Props, Values } from "./types";
import type { Option } from "../../types";

const DealForm: FC<Props> = ({
    isEditMode,
    initValues,
    onSubmit,
    onCancel,
 }) => {
    const {
        values,
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        getFieldProps,
    } = useFormik<Values>({
        initialValues: getInitValues(initValues),
        validationSchema,
        onSubmit: async (values: Values) => {
            await onSubmit(values);
        },
    });
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
                        options={[]}
                        error={!!(touched.pipeline && errors.pipeline)}
                        onChange={(value: Option<string>) => setFieldValue("owner", value)}
                    />
                </Label>

                <Label htmlFor="dealStage" label="Deal stage" required>
                    <SingleSelect
                        id="dealStage"
                        value={values.dealStage}
                        options={[]}
                        error={!!(touched.dealStage && errors.dealStage)}
                        onChange={(value: Option<string>) => setFieldValue("dealStage", value)}
                    />
                </Label>

                <Label htmlFor="amount" label="Amount">
                    <InputWithDisplay
                        id="amount"
                        type="text"
                        inputsize="small"
                        placeholder="Enter value"
                        {...getFieldProps("amount")}
                        error={!!(touched.amount && errors.amount)}
                    />
                </Label>

                <Label htmlFor="closeDate" label="Close date">
                    <InputWithDisplay
                        id="closeDate"
                        type="text"
                        inputsize="small"
                        placeholder="DD/MM/YYYY"
                        {...getFieldProps("closeDate")}
                        error={!!(touched.closeDate && errors.closeDate)}
                    />
                </Label>

                <Label htmlFor="dealOwner" label="Deal owner">
                    <SingleSelect
                        id="dealOwner"
                        value={values.dealOwner}
                        options={[]}
                        error={!!(touched.dealOwner && errors.dealOwner)}
                        onChange={(value: Option<string>) => setFieldValue("dealOwner", value)}
                    />
                </Label>

                <Label htmlFor="dealType" label="Deal type">
                    <SingleSelect
                        id="dealType"
                        value={values.dealType}
                        options={[]}
                        error={!!(touched.dealType && errors.dealType)}
                        onChange={(value: Option<string>) => setFieldValue("dealType", value)}
                    />
                </Label>

                <Label htmlFor="priority" label="Priority">
                    <SingleSelect
                        id="priority"
                        value={values.priority}
                        options={[]}
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
                            options={[]}
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
                            options={[]}
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
