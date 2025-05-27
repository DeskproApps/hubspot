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
    hs_email_to_firstname,
    hs_email_to_lastname,
    hs_email_from_firstname,
    hs_email_from_lastname,
    hs_timestamp,
    contacts,
    portalId,
    hs_object_id: id
}) => {
    const contactId = contacts[0]?.hs_object_id;

    return (
        <BaseContainer>
            <Title
                title={hs_email_subject || 'Email (No Subject)'}
                icon={<HubSpotLogo />}
                link={`https://app.hubspot.com/contacts/${portalId}/contact/${contactId}/?engagement=${id}`}
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
                label="Sent by"
                text={getFullName({
                    firstName: hs_email_from_firstname,
                    lastName: hs_email_from_lastname,
                })}
            />
            <TextBlockWithLabel
                label="Contacted"
                text={getFullName({
                    firstName: hs_email_to_firstname,
                    lastName: hs_email_to_lastname,
                })}
            />
            <TextBlockWithLabel
                label="Date/time"
                text={`${format(hs_timestamp)} at ${format(hs_timestamp, { date: false, time: true })}`}
            />
        </BaseContainer>
    )
};

export { Email };