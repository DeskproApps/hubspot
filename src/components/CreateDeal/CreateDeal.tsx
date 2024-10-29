import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getScreenStructure } from "../../utils";
import { fieldsMap } from "../fields";
import { ErrorBlock, FormBuilder, BaseContainer } from "../common";
import type { FC } from "react";
import type { ContextData, Settings } from "../../types";
import type { MetaMap, FormBuilderProps } from "../common/Builder";

type Props = {
    error: string|null;
    dealMeta: MetaMap;
    onSubmit: FormBuilderProps["onSubmit"];
    onCancel: FormBuilderProps["onCancel"];
};

const CreateDeal: FC<Props> = ({ error, ...props }) => {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = getScreenStructure(context?.settings, "deal", "view");

    return (
        <>
            {error && <ErrorBlock texts={[error]}/>}
            <BaseContainer>
                <FormBuilder
                    type="deals"
                    config={{ structure, metaMap: props.dealMeta }}
                    fieldsMap={fieldsMap}
                    onCancel={props.onCancel}
                    onSubmit={props.onSubmit}
                />
            </BaseContainer>
        </>
    );
};

export { CreateDeal };
