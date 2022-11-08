import { FC } from "react";
import { faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import {
    TSpan,
    DivAsInputWithDisplay,
} from "@deskpro/deskpro-ui";
import {
    Stack,
    Dropdown,
    DropdownValueType,
    HorizontalDivider,
    useDeskproAppTheme,
    DropdownTargetProps,
} from "@deskpro/app-sdk";
import {
    Label,
    Title,
    Button,
    TextArea,
    DateField,
    SingleSelect,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";
import {
    getInitValues,
    validationSchema,
} from "./utils";
import { useActivityTypeOptions } from "./hooks";
import type { Values, Props } from "./types";
import type { Option } from "../../types";
import type {Company, Contact} from "../../services/hubspot/types";

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
    const { theme } = useDeskproAppTheme();
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
            dealOptions,
            contactOptions,
            companyOptions,
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
                    withTime
                    required
                    id="timestamp"
                    label="Date/time"
                    error={Boolean(errors.timestamp)}
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

                <Dropdown
                    fetchMoreText="Fetch more"
                    autoscrollText="Autoscroll"
                    selectedIcon={faCheck}
                    externalLinkIcon={faExternalLinkAlt}
                    placement="bottom-start"
                    searchPlaceholder="Select value"
                    options={contactOptions}
                    onSelectOption={(option: DropdownValueType<Contact["id"]>) => {
                        if (option.value) {
                            const newValue = values.associateContact.includes(option.value)
                                ? values.associateContact.filter((contactId) => contactId !== option.value)
                                : [...values.associateContact, option.value]

                            setFieldValue("associateContact", newValue);
                        }
                    }}
                    closeOnSelect={false}
                >
                    {({targetProps, targetRef}: DropdownTargetProps<HTMLDivElement>) => (
                        <TextBlockWithLabel
                            label="Contact"
                            text={(
                                <DivAsInputWithDisplay
                                    ref={targetRef}
                                    {...targetProps}
                                    value={!values.associateContact.length
                                        ? (
                                            <TSpan overflow="ellipsis" type="p1" style={{color: theme.colors.grey40}}>
                                                Select value
                                            </TSpan>
                                        )
                                        : (
                                            <Stack gap={6} wrap="wrap">
                                                {contactOptions
                                                    .filter(({ value }) => values.associateContact.includes(value))
                                                    .map(({ label }) => label)
                                                    .join(", ")
                                                }
                                            </Stack>
                                        )}
                                    placeholder="Select value"
                                    variant="inline"
                                />
                            )}
                        />
                    )}
                </Dropdown>

                <Dropdown
                    fetchMoreText="Fetch more"
                    autoscrollText="Autoscroll"
                    selectedIcon={faCheck}
                    externalLinkIcon={faExternalLinkAlt}
                    placement="bottom-start"
                    searchPlaceholder="Select value"
                    options={companyOptions}
                    onSelectOption={(option: DropdownValueType<Company["id"]>) => {
                        if (option.value) {
                            const newValue = values.associateCompany.includes(option.value)
                                ? values.associateCompany.filter((id) => id !== option.value)
                                : [...values.associateCompany, option.value]

                            setFieldValue("associateCompany", newValue);
                        }
                    }}
                    closeOnSelect={false}
                >
                    {({targetProps, targetRef}: DropdownTargetProps<HTMLDivElement>) => (
                        <TextBlockWithLabel
                            label="Company"
                            text={(
                                <DivAsInputWithDisplay
                                    ref={targetRef}
                                    {...targetProps}
                                    value={!values.associateCompany.length
                                        ? (
                                            <TSpan overflow="ellipsis" type="p1" style={{color: theme.colors.grey40}}>
                                                Select value
                                            </TSpan>
                                        )
                                        : (
                                            <Stack gap={6} wrap="wrap">
                                                {companyOptions
                                                    .filter(({ value }) => values.associateCompany.includes(value))
                                                    .map(({ label }) => label)
                                                    .join(", ")
                                                }
                                            </Stack>
                                        )}
                                    placeholder="Select value"
                                    variant="inline"
                                />
                            )}
                        />
                    )}
                </Dropdown>

                <Dropdown
                    fetchMoreText="Fetch more"
                    autoscrollText="Autoscroll"
                    selectedIcon={faCheck}
                    externalLinkIcon={faExternalLinkAlt}
                    placement="bottom-start"
                    searchPlaceholder="Select value"
                    options={dealOptions}
                    onSelectOption={(option: DropdownValueType<Company["id"]>) => {
                        if (option.value) {
                            const newValue = values.associateDeal.includes(option.value)
                                ? values.associateDeal.filter((id) => id !== option.value)
                                : [...values.associateDeal, option.value]

                            setFieldValue("associateDeal", newValue);
                        }
                    }}
                    closeOnSelect={false}
                >
                    {({targetProps, targetRef}: DropdownTargetProps<HTMLDivElement>) => (
                        <TextBlockWithLabel
                            label="Deals"
                            text={(
                                <DivAsInputWithDisplay
                                    ref={targetRef}
                                    {...targetProps}
                                    value={!values.associateDeal.length
                                        ? (
                                            <TSpan overflow="ellipsis" type="p1" style={{color: theme.colors.grey40}}>
                                                Select value
                                            </TSpan>
                                        )
                                        : (
                                            <Stack gap={6} wrap="wrap">
                                                {dealOptions
                                                    .filter(({ value }) => values.associateDeal.includes(value))
                                                    .map(({ label }) => label)
                                                    .join(", ")
                                                }
                                            </Stack>
                                        )}
                                    placeholder="Select value"
                                    variant="inline"
                                />
                            )}
                        />
                    )}
                </Dropdown>
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
