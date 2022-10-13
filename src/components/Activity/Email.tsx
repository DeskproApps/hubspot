import { FC } from "react";
import { P5 } from "@deskpro/app-sdk";
import { Title, BaseContainer, TextBlockWithLabel } from "../common";
import { getFullName } from "../../utils";
import { format } from "../../utils/date";
import type { EmailActivity } from "../../services/hubspot/types";

const Email: FC<EmailActivity["properties"]> = ({
    hs_email_subject,
    hs_email_html,
    hs_email_to_firstname,
    hs_email_to_lastname,
    hs_email_from_firstname,
    hs_email_from_lastname,
    hs_timestamp,
}) => {
    return (
        <BaseContainer>
            {hs_email_subject && <Title title={hs_email_subject} />}
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
                text={getFullName({ firstName: hs_email_from_firstname, lastName: hs_email_from_lastname })}
            />
            <TextBlockWithLabel
                label="Contacted"
                text={getFullName({ firstName: hs_email_to_firstname, lastName: hs_email_to_lastname })}
            />
            <TextBlockWithLabel
                label="Date/time"
                text={`${format(hs_timestamp)} at ${format(hs_timestamp, "HH:mm")}`}
            />
        </BaseContainer>
    )
};

export { Email };
