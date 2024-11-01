import { useMemo } from "react";
import { Title, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getScreenStructure } from "../../utils";
import { blocksMap } from "../blocks";
import { BaseContainer, BlocksBuilder, HubSpotLogo } from "../common";
import type { FC } from "react";
import type { ContextData, Settings } from "../../types";
import type { Props } from "./types";

const DealInfo: FC<Props> = ({ deal, accountInfo, dealMetaMap }) => {
    const portalId = accountInfo?.portalId
    const dealId = deal.hs_object_id;
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = useMemo(() => {
        let layout = getScreenStructure(context?.settings, "deal", "view");

        if (layout[0].length === 1 && layout[0][0] === "dealname") {
            layout = [...layout.slice(1)];
        }

        return layout;
    }, [context?.settings]);

    return (
        <BaseContainer>
            <Title
                title={deal.dealname}
                marginBottom={0}
                {...((portalId && dealId)
                    ? {
                        link: `https://app.hubspot.com/contacts/${portalId}/deal/${dealId}`,
                        icon: <HubSpotLogo/>
                    }
                    : {}
                )}
            />
            <BlocksBuilder
                type="deals"
                config={{ structure, metaMap: dealMetaMap }}
                blocksMap={blocksMap}
                values={deal}
            />
        </BaseContainer>
    );
};

export { DealInfo };
