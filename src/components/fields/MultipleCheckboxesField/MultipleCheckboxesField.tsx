import { useMemo } from "react";
import { Select } from "@deskpro/app-sdk";
import { getOption } from "../../../utils";
import { Tag } from "../../common";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const MultipleCheckboxesField: FC<FieldProps> = ({ meta, formControl }) => {
    const options = useMemo(() => {
        return (meta?.options ?? []).map((o) => {
            return getOption(o.value, <Tag tag={o.label} />, o.label);
        });
    }, [meta?.options]);

    return (
        <Select
            id={meta.name}
            initValue={[]}
            options={options}
            showInternalSearch
            closeOnSelect={false}
            onChange={formControl.field.onChange}
        />
    );
};

export { MultipleCheckboxesField };
