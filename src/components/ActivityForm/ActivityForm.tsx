import { FC } from "react";
import { useFormik } from "formik";
import {
    Stack,
    HorizontalDivider,
} from "@deskpro/app-sdk";
import {
    Label,
    Title,
    Button,
    TextArea,
    DateField,
    SingleSelect,
    BaseContainer,
} from "../common";
import {
    getInitValues,
    validationSchema,
} from "./utils";
import { useActivityTypeOptions } from "./hooks";
import type { Values, Props } from "./types";
import type { Option } from "../../types";

const ActivityForm: FC<Props> = ({
    onCancel,
    onSubmit,
    initValues,
    dealOptions,
    contactOptions,
    companyOptions,
    callDirectionOptions,
    callDispositionOptions,
}) => {
    const { activityTypeOptions } = useActivityTypeOptions();
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = useFormik<Values>({
        initialValues: getInitValues(initValues, {
            contactOptions
        }),
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <BaseContainer>
                <Label htmlFor="activityType" label="Activity" required>
                    <SingleSelect
                        id="activityType"
                        value={values.activityType}
                        options={activityTypeOptions}
                        error={!!(touched.activityType && errors.activityType)}
                        onChange={(value: Option<string>) => setFieldValue("activityType", value)}
                    />
                </Label>

                <Label htmlFor="description" label="Description" required>
                    <TextArea
                        id="description"
                        minWidth="auto"
                        placeholder="Enter value"
                        {...getFieldProps("description")}
                        error={!!(touched.description && errors.description)}
                    />
                </Label>

                <DateField
                    id="timestamp"
                    label="Date/time"
                    error={!!(touched.timestamp && errors.timestamp)}
                    {...getFieldProps("timestamp")}
                    onChange={(date: [Date]) => setFieldValue("timestamp", date[0])}
                />

                <Label htmlFor="contacted" label="Contacted">
                    <SingleSelect
                        id="contacted"
                        value={values.contacted}
                        options={contactOptions}
                        error={!!(touched.contacted && errors.contacted)}
                        onChange={(value: Option<string>) => setFieldValue("contacted", value)}
                    />
                </Label>

                <Label htmlFor="callDisposition" label="Call outcome">
                    <SingleSelect
                        id="callDisposition"
                        value={values.callDisposition}
                        options={callDispositionOptions}
                        error={!!(touched.callDisposition && errors.callDisposition)}
                        onChange={(value: Option<string>) => setFieldValue("callDisposition", value)}
                    />
                </Label>

                <Label htmlFor="callDirection" label="Direction">
                    <SingleSelect
                        id="callDirection"
                        value={values.callDirection}
                        options={callDirectionOptions}
                        error={!!(touched.callDirection && errors.callDirection)}
                        onChange={(value: Option<string>) => setFieldValue("callDirection", value)}
                    />
                </Label>
            </BaseContainer>

            <HorizontalDivider/>

            <BaseContainer>
                <Title title="Associate activity with"/>

                <Label htmlFor="associateContact" label="Contact">
                    <SingleSelect
                        id="associateContact"
                        value={values.associateContact}
                        options={contactOptions}
                        error={!!(touched.associateContact && errors.associateContact)}
                        onChange={(value: Option<string>) => setFieldValue("associateContact", value)}
                    />
                </Label>

                <Label htmlFor="associateCompany" label="Company">
                    <SingleSelect
                        id="associateCompany"
                        value={values.associateCompany}
                        options={companyOptions}
                        error={!!(touched.associateCompany && errors.associateCompany)}
                        onChange={(value: Option<string>) => setFieldValue("associateCompany", value)}
                    />
                </Label>

                <Label htmlFor="associateDeal" label="Deal">
                    <SingleSelect
                        id="associateDeal"
                        value={values.associateDeal}
                        options={dealOptions}
                        error={!!(touched.associateDeal && errors.associateDeal)}
                        onChange={(value: Option<string>) => setFieldValue("associateDeal", value)}
                    />
                </Label>
            </BaseContainer>

            <BaseContainer>
                <Stack justify="space-between">
                    <Button
                        type="submit"
                        text="Create"
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

export { ActivityForm };
