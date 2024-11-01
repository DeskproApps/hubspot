import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getScreenStructure } from "../../utils";
import { fieldsMap } from "../fields";
import { ErrorBlock, FormBuilder, BaseContainer } from "../common";
import type { FC } from "react";
import type { ContextData, Settings } from "../../types";
import type { Deal } from "../../services/hubspot/types";
import type { MetaMap, FormBuilderProps } from "../common/Builder";

type Props = {
    deal: Deal["properties"];
    dealMeta: MetaMap;
    error: string|null;
    onSubmit: FormBuilderProps["onSubmit"];
    onCancel: FormBuilderProps["onCancel"];
};

const UpdateDeal: FC<Props> = ({ error, dealMeta, deal, onCancel, onSubmit }) => {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = getScreenStructure(context?.settings, "deal", "view");

    return (
        <>
            <BaseContainer>
                {error && <ErrorBlock texts={[error]}/>}
                <FormBuilder
                    isEditMode
                    type="deals"
                    values={deal}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    fieldsMap={fieldsMap}
                    config={{ structure, metaMap: dealMeta }}
                />
            </BaseContainer>
        </>
    )
};

export { UpdateDeal };
