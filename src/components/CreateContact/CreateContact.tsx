import { fieldsMap } from "../fields";
import { ErrorBlock, Navigation, BaseContainer, FormBuilder } from "../common";
import type { FC } from "react";
import type { FormBuilderProps } from "../common/Builder";

type Props = Pick<FormBuilderProps, "config"|"onCancel"|"onSubmit"|"values"> & {
    errors: string[];
    onNavigateToLink: () => void;
};

const CreateContact: FC<Props> = ({ onNavigateToLink, errors, ...props }) => {
    return (
        <BaseContainer>
            <Navigation onNavigateToLink={onNavigateToLink} />
            {(errors.length > 0) && <ErrorBlock texts={errors}/>}
            <FormBuilder fieldsMap={fieldsMap} {...props} />
        </BaseContainer>
    );
};

export { CreateContact };
