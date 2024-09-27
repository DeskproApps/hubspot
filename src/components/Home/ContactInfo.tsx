import { FC } from "react";
import isEmpty from "lodash/isEmpty";
import capitalize from "lodash/capitalize";
import {
    HorizontalDivider,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getFullName, getScreenStructure } from "../../utils";
import {
    Title,
    BlocksBuilder,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";
import { blocksMap } from "../blocks";
import type { AccountInto, Contact, Owner, PropertyMeta } from "../../services/hubspot/types";

type Props = {
    contact: Contact["properties"],
    companies: Array<{
        name: string,
    }>,
    owners: Record<Owner["id"], Owner>,
    accountInfo?: AccountInto,
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
};

const ContactInfo: FC<Props> = ({
    contact,
    owners,
    companies,
    accountInfo: { portalId } = {},
    contactMetaMap,
}) => {
    const { context } = useDeskproLatestAppContext();
    const structure = getScreenStructure(context?.settings, "contact", "home");
    const {
        email,
        phone,
        jobtitle,
        lifecyclestage,
        hubspot_owner_id,
        lastname: lastName,
        firstname: firstName,
        hs_object_id: contactId,
    } = contact;

    return (
        <>
            <BlocksBuilder<PropertyMeta>
                config={{ structure, metaMap: contactMetaMap }}
                blocksMap={blocksMap}
                values={contact}
            />
            <BaseContainer>
                <Title
                    title={getFullName({ firstName, lastName }) || email || ""}
                    link={(portalId && contactId)
                        ? `https://app.hubspot.com/contacts/${portalId}/contact/${contactId}`
                        : ""
                    }
                />
                <TextBlockWithLabel label="Email" text={email || "-"} />
                <TextBlockWithLabel label="Phone" text={phone || "-"} />
                <TextBlockWithLabel label="Job title" text={jobtitle || "-"} />
                <TextBlockWithLabel label="Owner" text={getFullName(owners[hubspot_owner_id as string]) || "-"} />
                <TextBlockWithLabel
                    label="Lifecycle stage"
                    text={!isEmpty(lifecyclestage) ? capitalize(lifecyclestage) : "-"}
                />
                <TextBlockWithLabel
                    label="Primary company"
                    text={(Array.isArray(companies) && companies.length > 0) ?
                        companies.map(({ name }) => name).filter(Boolean).join(", ")
                        : "-"
                    }
                />
            </BaseContainer>
            <HorizontalDivider/>
        </>
    );
}

export { ContactInfo };
