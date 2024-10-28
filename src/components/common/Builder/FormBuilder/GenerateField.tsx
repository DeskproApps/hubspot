import { Controller } from "react-hook-form";
import { Label } from "../../Label";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { FieldProps } from "./types";

type Props = {
    meta: PropertyMeta;
    control: Control<Record<string, string>>,
    Component: FC<FieldProps>;
};

const GenerateField: FC<Props> = ({ meta, control, Component }) => {
    return (
        <Label label={meta.label || meta.name}>
            <Controller
                name={meta.name}
                control={control}
                render={(formControl) => (
                    <Component meta={meta} formControl={formControl} />
                )}
        />
        </Label>
    );
};

export { GenerateField };
