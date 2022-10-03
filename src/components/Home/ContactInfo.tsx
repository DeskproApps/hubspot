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

type Props = {
    contact: {
        email: string,
        phone: string,
        jobtitle: string,
        lastname: string,
        firstname: string,
        lifecyclestage: string,
    },
    companies: Array<{
        name: string,
    }>,
    owner: {
        firstName: string,
        lastName: string,
    }
};

const ContactInfo: FC<Props> = ({
    contact: {
        email,
        phone,
        jobtitle,
        lifecyclestage,
        lastname: lastName,
        firstname: firstName,
    } = {},
    owner,
    companies,
}) => {
    return (
        <section>
            <BaseContainer>
                {/* https://app.hubspot.com/contacts/{portalId}/{objectType}/{objectId} */}
                {/* https://api.hubapi.com/integrations/v1/me?hapikey=demo */}
                <Title
                    title={getFullName({ firstName, lastName }) || email}
                    link=""
                />
                <TextBlockWithLabel label="Email" text={email ?? "-"} />
                <TextBlockWithLabel label="Phone" text={phone ?? "-"} />
                <TextBlockWithLabel label="Job title" text={jobtitle ?? "-"} />
                <TextBlockWithLabel label="Owner" text={getFullName(owner) || "-"} />
                <TextBlockWithLabel
                    label="Lifecycle stage"
                    text={!isEmpty(lifecyclestage) ? capitalize(lifecyclestage) : "-"}
                />
                <TextBlockWithLabel
                    label="Primary company"
                    text={companies?.map(({ name }) => name).filter(Boolean).join(", ") ?? "-"}
                />
            </BaseContainer>
            <HorizontalDivider/>
        </section>
    );
}

export { ContactInfo };
