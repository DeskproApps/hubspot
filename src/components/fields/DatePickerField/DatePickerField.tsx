import { DateInput } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const DatePickerField: FC<FieldProps> = ({ meta, formControl }) => {
    return (
        <DateInput
            enableTime={meta.type === "datetime"}
            id={meta.name}
            error={false}
            placeholder="DD/MM/YYYY"
            value={formControl.field.value}
            onChange={(date: Date[]) => formControl.field.onChange(date[0])}
        />
    );
};

export { DatePickerField };
