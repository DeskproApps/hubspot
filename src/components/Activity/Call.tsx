import { FC } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { Title, BaseContainer, TextBlockWithLabel } from "../common";
import { getFullName } from "../../utils";
import { format, msToDuration } from "../../utils/date";
import type { CallActivity, Contact, Owner } from "../../services/hubspot/types";

type Props = CallActivity["properties"] & {
    contacts: Array<Contact["properties"]>,
    owner?: Owner,
}

const Call: FC<Props> = ({
    hs_call_title,
    hs_call_body,
    hs_call_duration,
    hs_timestamp,
    contacts,
    owner,
}) => {
    return (
        <BaseContainer>
            {hs_call_title && <Title title={hs_call_title} />}
            <TextBlockWithLabel
                label="Description"
                text={
                    !hs_call_body
                        ? "-"
                        : <P5 dangerouslySetInnerHTML={{ __html: hs_call_body }} />
                }
            />
            <TextBlockWithLabel label="Call by" text={getFullName(owner)} />
            <TextBlockWithLabel
                label="Direction"
                text={contacts
                    .map(({ firstname, lastname }) => getFullName({
                        firstName: firstname,
                        lastName: lastname,
                    }))
                    .join(", ")}
            />
            <TextBlockWithLabel
                label="Duration"
                text={!hs_call_duration ? "-" : msToDuration(hs_call_duration)}
            />
            <TextBlockWithLabel
                label="Date/time"
                text={`${format(hs_timestamp)} at ${format(hs_timestamp, { date: false, time: true })}`}
            />
        </BaseContainer>
    )
};

export { Call };
