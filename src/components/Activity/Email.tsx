import { FC } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { BaseContainer, HubSpotLogo, TextBlockWithLabel } from "../common";
import { getFullName } from "../../utils";
import { format } from "../../utils/date";
import type { Contact, EmailActivity } from "../../services/hubspot/types";

type Props = EmailActivity['properties'] & {
    contacts: Array<Contact['properties']>,
    portalId?: number;
};

const Email: FC<Props> = ({
    hs_email_subject,
    hs_email_html,
    hs_timestamp,
    contacts,
    portalId,
    hs_object_id
}) => {
    const contactId = contacts[0]?.hs_object_id;
    const contacted = contacts.map(contact => {
        const fullName = getFullName({
            firstName: contact.firstname,
            lastName: contact.lastname
        });

        return fullName ? `${fullName} (${contact.email})` : contact.email;
    }).join('<br />');

    return (
        <BaseContainer>
            <Title
                title={hs_email_subject || 'Email (No Subject)'}
                icon={<HubSpotLogo />}
                link={`https://app.hubspot.com/contacts/${portalId}/contact/${contactId}/?engagement=${hs_object_id}`}
            />
            <TextBlockWithLabel
                label="Description"
                text={
                    !hs_email_html
                        ? "-"
                        : <P5 dangerouslySetInnerHTML={{ __html: hs_email_html }}/>
                }
            />
            <TextBlockWithLabel
                label="Contacted"
                text={contacted}
            />
            <TextBlockWithLabel
                label="Date/time"
                text={`${format(hs_timestamp)} at ${format(hs_timestamp, { date: false, time: true })}`}
            />
        </BaseContainer>
    )
};

export { Email };