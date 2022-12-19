import { FC } from "react";
import { useFormik } from "formik";
import { Stack } from "@deskpro/app-sdk";
import { validationSchema, getInitValues } from "./utils";
import { Attach, Label, Button, TextArea } from "../common";
import type { Props, Values } from "./types";

const NoteForm: FC<Props> = ({ onSubmit, onCancel }) => {
    const {
        errors,
        touched,
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
            <Label htmlFor="note" label="New notes" required>
                <TextArea
                    id="note"
                    minWidth="auto"
                    placeholder="Enter note"
                    {...getFieldProps("note")}
                    error={!!(touched.note && errors.note)}
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
                    disabled={isSubmitting/* || isEmptyForm(values)*/}
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
