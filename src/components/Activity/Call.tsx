import { FC } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { BaseContainer, HubSpotLogo, TextBlockWithLabel } from "../common";
import { getFullName, getOption } from "../../utils";
import { format } from "../../utils/date";
import type { CallActivity, CallDispositions, Contact } from "../../services/hubspot/types";
import { useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getActivityCallDispositionsServices } from "../../services/hubspot";

type Props = CallActivity["properties"] & {
    contacts: Array<Contact["properties"]>,
    portalId?: number
};

const Call: FC<Props> = ({
    hs_call_title,
    hs_call_body,
    hs_timestamp,
    contacts,
    portalId,
    hs_object_id,
    hs_call_direction,
    hs_call_disposition
}) => {
    const contactId = contacts[0]?.hs_object_id;
    const contacted = contacts.map(contact => {
        const fullName = getFullName({
            firstName: contact.firstname,
            lastName: contact.lastname
        });

        return fullName ? `${fullName} (${contact.email})` : contact.email;
    }).join('<br />');

    const callDispositions = useQueryWithClient(
        [QueryKey.CALL_ACTIVITIES, 'dispositions'],
        getActivityCallDispositionsServices,
        {
            select: data => {
                return data
                    ?.filter(({ deleted }) => !deleted)
                    .map(({ id, label }) => getOption<CallDispositions['id']>(id, label)) || [];
            }
        }
    );

    const disposition = callDispositions.data?.find(disposition => disposition.value === hs_call_disposition);
    const outcome = disposition?.label;

    return (
        <BaseContainer>
            {hs_call_title && hs_object_id && (
                <Title
                    title={hs_call_title}
                    icon={<HubSpotLogo />}
                    link={`https://app.hubspot.com/contacts/${portalId}/contact/${contactId}/?engagement=${hs_object_id}`}
                />
            )}
            <TextBlockWithLabel
                label="Description"
                text={
                    !hs_call_body
                        ? "-"
                        : <P5 dangerouslySetInnerHTML={{ __html: hs_call_body }} />
                }
            />
            <TextBlockWithLabel
                label="Contacted"
                text={contacted}
            />
            <TextBlockWithLabel
                label='Outcome'
                text={typeof outcome === 'string' || typeof outcome === 'number' ? outcome : '-'}
            />
            <TextBlockWithLabel
                label="Direction"
                text={hs_call_direction && (hs_call_direction.charAt(0).toUpperCase() + hs_call_direction.slice(1).toLowerCase())}
            />
            <TextBlockWithLabel
                label="Date/time"
                text={`${format(hs_timestamp)} at ${format(hs_timestamp, { date: false, time: true })}`}
            />
        </BaseContainer>
    )
};

export { Call };