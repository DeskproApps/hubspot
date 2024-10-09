import { Controller } from "react-hook-form";
import { Label } from "../../Label";
import type { FC, ComponentType } from "react";
import type { Control } from "react-hook-form";
import type { PropertyMeta } from "../../../../services/hubspot/types";

type Props = {
    control: Control<Record<string, unknown>>,
    meta?: PropertyMeta;
    value?: unknown;
    Component?: ComponentType<Record<string, unknown>>;
};

const GenerateField: FC<Props> = ({ meta, control, Component }) => {
    const fieldType = meta?.fieldType;
    const label = meta?.label;

    if (!meta) {
        // eslint-disable-next-line no-console
        console.error("FormBuilder: wrong config - block config not found");
        return null;
    }

    if (!Component) {
        // eslint-disable-next-line no-console
        console.error("FormBuilder: can't find component for block type:", fieldType);
        return null;
    }

    return (
        <Label label={label}>
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
