import { Select } from "@deskpro/app-sdk";
import { useRadioField } from "./hooks";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const RadioField: FC<FieldProps<string>> = ({ meta, formControl }) => {
    const { options } = useRadioField(meta);

    return (
        <Select
            id={meta.name}
            value={`${formControl.field.value}` || ""}
            options={options}
            onChange={formControl.field.onChange}
        />
    )
};

export { RadioField };
