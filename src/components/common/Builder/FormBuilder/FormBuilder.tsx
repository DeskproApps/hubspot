import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@deskpro/deskpro-ui";
import { BuilderProvider } from "../hooks";
import { flatten } from "../../../../utils";
import { validateConfig, getInitValues, getValidationSchema } from "./utils";
import { Button } from "../../Button";
import { GenerateField } from "./GenerateField";
import type { FC } from "react";
import type { ZodTypeAny } from "zod";
import type { FormBuilderProps } from "./types";

const RenderForm: FC<FormBuilderProps> = ({
    type,
    values,
    fieldsMap,
    config: { structure, metaMap },
    onSubmit,
    onCancel,
    isEditMode,
}) => {
    const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));
    const form = useForm({
        defaultValues: getInitValues(flatten(structure), values),
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        setSchema(getValidationSchema(flatten(structure)));
    }, [structure, metaMap]);

    return (
        <BuilderProvider type={type}>
            <form
                style={{ marginTop: 8, marginBottom: 8 }}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {flatten(structure).map((fieldName) => {
                    const meta = metaMap[fieldName];
                    const fieldType = meta.fieldType;
                    const Component = fieldsMap[fieldType];

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
                        <GenerateField
                            key={fieldName}
                            meta={meta}
                            control={form.control}
                            Component={Component}
                        />
                    )
                })}
                <Stack justify="space-between">
                    <Button
                        type="submit"
                        text={isEditMode ? "Save" : "Create"}
                        disabled={form.formState.isSubmitting}
                        loading={form.formState.isSubmitting}
                    />
                    {onCancel && (
                        <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
                    )}
                </Stack>
            </form>
        </BuilderProvider>
    );
};

const FormBuilder: FC<FormBuilderProps> = (props) => {
    try {
        validateConfig(props.config.structure, props.config.metaMap);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return null;
    }

    return (
        <RenderForm {...props} />
    );
};

export { FormBuilder };
