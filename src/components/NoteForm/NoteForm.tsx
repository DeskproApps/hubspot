import { FC } from "react";
import { useFormik } from "formik";
import { Stack } from "@deskpro/app-sdk";
import { validationSchema, getInitValues, isEmptyForm } from "./utils";
import {
    Label,
    Attach,
    Button,
    TextArea,
} from "../common";
import type { Props, Values } from "./types";

const NoteForm: FC<Props> = ({ onSubmit, onCancel }) => {
    const {
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        getFieldProps,
    } = useFormik<Values>({
        validationSchema,
        initialValues: getInitValues(),
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="note" label="New notes">
                <TextArea
                    id="note"
                    minWidth="auto"
                    placeholder="Enter note"
                    {...getFieldProps("note")}
                />
            </Label>

            <Label label="Attachments">
                <Attach
                    onFiles={(files) => {
                        setFieldValue("files", files);
                    }}
                />
            </Label>

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text="Add"
                    disabled={isSubmitting || isEmptyForm(values)}
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

export { NoteForm };
