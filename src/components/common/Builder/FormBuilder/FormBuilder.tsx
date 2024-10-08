import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@deskpro/deskpro-ui";
import { flatten } from "../../../../utils";
import { validateConfig, getInitValues, getValidationSchema } from "./utils";
import { Button } from "../../Button";
import { GenerateField } from "./GenerateField";
import type { FC } from "react";
import type { ZodTypeAny } from "zod";
import type { FormBuilderProps } from "./types";

const RenderForm: FC<FormBuilderProps> = ({
    values,
    fieldsMap,
    config: { structure, metaMap },
    onSubmit,
    onCancel,
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
        <form
            style={{ marginTop: 8, marginBottom: 8 }}
            onSubmit={form.handleSubmit(onSubmit)}
        >
            {flatten(structure).map((fieldName) => {
                const meta = metaMap[fieldName];
                const fieldType = meta.fieldType;
                const Component = fieldsMap[fieldType];

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
                    text="Create"
                    disabled={form.formState.isSubmitting}
                    loading={form.formState.isSubmitting}
                />
                {onCancel && (
                    <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
                )}
            </Stack>
        </form>
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
