import type { FC } from "react";
import type {
    SubmitHandler,
    UseFormStateReturn,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { Layout } from "../types";

export type Meta = Record<PropertyMeta["name"], PropertyMeta>;

export type Values = Record<PropertyMeta["name"], unknown>;

export type Config = {
    structure: Layout;
    metaMap: Meta;
};

export type FieldsMap = Record<PropertyMeta["fieldType"], FC<FieldProps>>;

export type FormBuilderProps = {
    config: Config;
    fieldsMap: FieldsMap;
    onSubmit: SubmitHandler<Values>;
    values?: Values;
    onCancel?: () => void;
};

export type FieldProps<T = unknown> = {
    meta: PropertyMeta,
    formControl: {
      field: ControllerRenderProps<Record<PropertyMeta["name"], T>>,
      fieldState: ControllerFieldState,
      formState: UseFormStateReturn<Record<PropertyMeta["name"], T>>,
    },
};
