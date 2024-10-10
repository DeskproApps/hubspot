import { fieldsMap } from "../fields";
import { ErrorBlock, BaseContainer, FormBuilder } from "../common";
import type { FC } from "react";
import type { FormBuilderProps } from "../common/Builder";

type Props = Pick<FormBuilderProps, "config"|"onCancel"|"onSubmit"|"values"> & {
    errors: string[];
};

const UpdateContact: FC<Props> = ({ errors, ...props }) => {
    return (
        <BaseContainer>
            {(errors.length > 0) && <ErrorBlock texts={errors}/>}
            <FormBuilder isEditMode fieldsMap={fieldsMap} {...props} />
        </BaseContainer>
    );
};

export { UpdateContact };
