import { FC } from "react";
import {
    HorizontalDivider,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getFullName, getScreenStructure } from "../../utils";
import {
    Title,
    BlocksBuilder,
    BaseContainer,
} from "../common";
import { blocksMap } from "../blocks";
import type { AccountInto, Contact, PropertyMeta } from "../../services/hubspot/types";

type Props = {
    contact: Contact["properties"],
    accountInfo?: AccountInto,
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
};

const ContactInfo: FC<Props> = ({
    contact,
    accountInfo: { portalId } = {},
    contactMetaMap,
}) => {
    const { context } = useDeskproLatestAppContext();
    const structure = getScreenStructure(context?.settings, "contact", "home");

    return (
        <>
            <BaseContainer>
                <Title
                    title={getFullName({ firstName: contact.firstname, lastName: contact.lastname }) || contact.email || ""}
                    link={(portalId && contact.hs_object_id)
                        ? `https://app.hubspot.com/contacts/${portalId}/contact/${contact.hs_object_id}`
                        : ""
                    }
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
}

export { ContactInfo };
