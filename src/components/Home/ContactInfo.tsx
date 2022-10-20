import { FC } from "react";
import isEmpty from "lodash/isEmpty";
import capitalize from "lodash/capitalize";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { getFullName } from "../../utils";
import {
    Title,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";
import type { AccountInto, Contact } from "../../services/hubspot/types";

type Props = {
    contact: Contact["properties"],
    companies: Array<{
        name: string,
    }>,
    owner?: {
        firstName: string,
        lastName: string,
    },
    accountInfo?: AccountInto,
};

const ContactInfo: FC<Props> = ({
    contact: {
        email,
        phone,
        jobtitle,
        lifecyclestage,
        lastname: lastName,
        firstname: firstName,
        hs_object_id: contactId,
    } = {},
    owner,
    companies,
    accountInfo: { portalId } = {},
}) => {
    return (
        <section>
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
                <TextBlockWithLabel label="Owner" text={getFullName(owner) || "-"} />
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
        </section>
    );
}

export { ContactInfo };
