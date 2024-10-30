import { TextArea } from "../../common";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const TextAreaField: FC<FieldProps<string>> = ({ formControl }) => {
    const fieldName = formControl.field.name;
    return (
        <TextArea
            id={fieldName}
            error={Boolean(formControl.formState.errors[fieldName]?.message)}
            {...formControl.field}
        />
    );
};

export { TextAreaField };
