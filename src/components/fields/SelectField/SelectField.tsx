import { Select } from "@deskpro/app-sdk";
import { useSelectField } from "./hooks";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const SelectField: FC<FieldProps<string>> = ({ meta, formControl }) => {
    const { options } = useSelectField(meta);

    return (
        <Select
            id={meta.name}
            initValue={`${formControl.field.value}` || ""}
            options={options}
            onChange={formControl.field.onChange}
        />
    );
};

export { SelectField };
