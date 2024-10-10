import {
    Title,
    HorizontalDivider,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getFullName, getScreenStructure } from "../../utils";
import { BaseContainer, BlocksBuilder, HubSpotLogo } from "../common";
import { blocksMap } from "../blocks";
import type { FC } from "react";
import type { Contact, PropertyMeta, AccountInto } from "../../services/hubspot/types";

type Props = {
    accountInfo: AccountInto,
    contact: Contact["properties"],
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
};

const ViewContact: FC<Props> = ({
    contact,
    contactMetaMap,
    accountInfo: { portalId } = {},
}) => {
    const { context } = useDeskproLatestAppContext();
    const structure = getScreenStructure(context?.settings, "contact", "view");

    return (
        <>
            <BaseContainer>
                <Title
                    title={getFullName(contact) || "-"}
                    link={(portalId && contact.hs_object_id)
                        ? `https://app.hubspot.com/contacts/${portalId}/contact/${contact.hs_object_id}`
                        : ""
                    }
                    icon={<HubSpotLogo/>}
                />
            </BaseContainer>
            <BlocksBuilder
                config={{ structure, metaMap: contactMetaMap }}
                blocksMap={blocksMap}
                values={contact}
            />
            <HorizontalDivider/>
        </>
    );
};

export { ViewContact };
