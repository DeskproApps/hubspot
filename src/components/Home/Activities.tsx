import { FC } from "react";
import concat from "lodash/concat";
import capitalize from "lodash/capitalize";
import isBefore from "date-fns/isBefore";
import styled from "styled-components";
import { H3 } from "@deskpro/deskpro-ui";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import {
    Link,
    TwoColumn,
    HubSpotLogo,
    OverflowText,
    BaseContainer,
} from "../common";
import { format } from "../../utils/date";
import type { DateTime } from "../../types";
import type { EmailActivity, CallActivity, AccountInto, Contact } from "../../services/hubspot/types";

type Props = {
    calls: Array<CallActivity["properties"]>,
    emails: Array<EmailActivity["properties"]>,
    onCreateActivity: () => void,
    accountInfo?: AccountInto,
    contactId?: Contact["id"],
};

type ActivityProps = {
    id: string,
    title?: string,
    body?: string,
    date: DateTime,
    type: "call" | "email",
    contactId?: Contact["id"],
    portalId?: AccountInto["portalId"],
};

const TitleLink = styled(Link)`
    p {
      margin: 0;
    }
`;

const ClampedTitle = styled.div`
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
`;

const normalizeCallFn = (call: CallActivity["properties"]): ActivityProps => ({
    id: call.hs_object_id,
    title: call.hs_call_title,
    body: call.hs_call_body,
    date: call.hs_timestamp,
    type: "call",
});

const normalizeEmailFn = (email: EmailActivity["properties"]): ActivityProps => ({
    id: email.hs_object_id,
    title: email.hs_body_preview || email.hs_email_subject,
    body: email.hs_email_html,
    date: email.hs_timestamp,
    type: "email",
});

const sortDateFn = (a: ActivityProps, b: ActivityProps) => {
    return isBefore(new Date(a.date), new Date(b.date)) ? 1 : -1;
}

const Activity: FC<ActivityProps> = ({ id, title, body, date, type, portalId, contactId }) => (
    <>
        {title && (
            <Title
                as={H3} // eslint-disable-line @typescript-eslint/no-unsafe-assignment
                title={(
                    <ClampedTitle>
                        <Link
                            to={`/contacts/activities?type=${type}&activityId=${id}`}
                        >{title}</Link>
                    </ClampedTitle>
                )}
                marginBottom={7}
                {...((!portalId || !contactId) ? {} : {
                    link: `https://app.hubspot.com/contacts/${portalId}/contact/${contactId}/?engagement=${id}`,
                    icon: <HubSpotLogo/>,
                })}
            />
        )}
        {(!title && body) && (
            <Title
                as={H3} // eslint-disable-line @typescript-eslint/no-unsafe-assignment
                title={(
                    <TitleLink to={`/contacts/activities?type=${type}&activityId=${id}`}>
                        <OverflowText dangerouslySetInnerHTML={{ __html: body }}/>
                    </TitleLink>
                )}
                {...((!portalId || !contactId) ? {} : {
                    link: `https://app.hubspot.com/contacts/${portalId}/contact/${contactId}/?engagement=${id}`,
                    icon: <HubSpotLogo/>,
                })}
            />
        )}
        <TwoColumn
            leftLabel="Type"
            leftText={capitalize(type)}
            rightLabel="Date"
            rightText={format(date, { time: true })}
        />
        <HorizontalDivider style={{ marginBottom: 9 }}/>
    </>
);

const Activities: FC<Props> = ({ calls, emails, accountInfo, contactId, onCreateActivity }) => {
    const normalizeCall = calls?.map(normalizeCallFn) ?? [];
    const normalizeEmail = emails?.map(normalizeEmailFn) ?? [];
    const activities = concat(normalizeCall, normalizeEmail).sort(sortDateFn);

    return (
        <BaseContainer>
            <Title title={`Activities (${activities.length})`} onClick={onCreateActivity}/>
            {activities.map((activity) => (
                <Activity
                    key={activity.id}
                    {...activity}
                    portalId={accountInfo?.portalId}
                    contactId={contactId}
                />
            ))}
        </BaseContainer>
    );
}

export { Activities };