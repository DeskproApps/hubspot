import { FC } from "react";
import concat from "lodash/concat";
import capitalize from "lodash/capitalize";
import isAfter from "date-fns/isAfter";
import { H3, HorizontalDivider } from "@deskpro/app-sdk";
import {
    Link,
    Title,
    TwoColumn,
    OverflowText,
    BaseContainer,
} from "../common";
import { format } from "../../utils/date";
import type { DateTime } from "../../types";
import type { EmailActivity, CallActivity } from "../../services/hubspot/types";

type ActivityProps = {
    id: string,
    title?: string,
    body?: string,
    date: DateTime,
    type: "call" | "email";
};

const normalizeCallFn = (call: CallActivity["properties"]): ActivityProps => ({
    id: call.hs_object_id,
    title: call.hs_call_title,
    body: call.hs_call_body,
    date: call.hs_timestamp,
    type: "call",
});

const normalizeEmailFn = (email: EmailActivity["properties"]): ActivityProps => ({
    id: email.hs_object_id,
    title: email.hs_email_subject,
    body: email.hs_email_text,
    date: email.hs_timestamp,
    type: "email",
});

const sortDateFn = (a: ActivityProps, b: ActivityProps) => isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1;

const Activity: FC<ActivityProps> = ({ id, title, body, date, type }) => (
    <>
        {title && (
            <Title
                as={H3}
                title={(
                    <Link
                        to={`/contacts/activities?type=${type}&activityId=${id}`}
                    >{title}</Link>
                )}
                marginBottom={7}
            />
        )}
        {(!title && body) && (
            <Link to={`/contacts/activities?type=${type}&activityId=${id}`}>
                <OverflowText as={H3} style={{ marginBottom: 7 }}>{body}</OverflowText>
            </Link>
        )}
        <TwoColumn
            leftLabel="Type"
            leftText={capitalize(type)}
            rightLabel="Date"
            rightText={format(date)}
        />
        <HorizontalDivider style={{ marginBottom: 9 }}/>
    </>
);

const Activities: FC<{
    calls: Array<CallActivity["properties"]>,
    emails: Array<EmailActivity["properties"]>,
}> = ({ calls, emails }) => {
    const normalizeCall = calls.map(normalizeCallFn);
    const normalizeEmail = emails.map(normalizeEmailFn);
    const activities = concat(normalizeCall, normalizeEmail).sort(sortDateFn);

    return (
        <BaseContainer style={{ marginBottom: 40 }}>
            <Title title={`Activities (${activities.length})`}/>
            {activities.map((activity) => (
                <Activity key={activity.id} {...activity} />
            ))}
        </BaseContainer>
    );
}

export { Activities };