import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getScreenStructure } from "../../utils";
import { fieldsMap } from "../fields";
// import { DealForm } from "../DealForm";
import { ErrorBlock, FormBuilder, BaseContainer } from "../common";
import type { FC } from "react";
import type { ContextData, Settings } from "../../types";
import type { MetaMap } from "../common/Builder";
import type { Props as FormProps } from "../DealForm/types";

type Props = FormProps & {
    error: string|null;
    dealMeta: MetaMap;
};

const CreateDeal: FC<Props> = ({ error, ...props }) => {
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = getScreenStructure(context?.settings, "deal", "view");

    // console.log(">>> deal:", props);

    return (
        <>
            {error && <ErrorBlock texts={[error]}/>}
            {/* <DealForm {...props} /> */}
            <BaseContainer>
                <FormBuilder
                    config={{ structure, metaMap: props.dealMeta }}
                    fieldsMap={fieldsMap}
                    onSubmit={() => {
                        // console.log(">>> onSubmit:", value);
                    }}
                />
            </BaseContainer>
        </>
    );
};

export { CreateDeal };
