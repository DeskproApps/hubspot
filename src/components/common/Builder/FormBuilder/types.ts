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

export type Config = {
    structure: Layout;
    metaMap: Meta;
};

export type FieldsMap = Record<PropertyMeta["fieldType"], FC>;

export type FormBuilderProps = {
    config: Config;
    fieldsMap: FieldsMap;
    onSubmit: SubmitHandler<Record<string, unknown>>;
    values?: Record<PropertyMeta["name"], unknown>;
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
