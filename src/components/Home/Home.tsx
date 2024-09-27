import { FC } from "react";
import { ContactInfo } from "./ContactInfo";
import { Deals } from "./Deals";
import { Notes } from "./Notes";
import { Activities } from "./Activities";
import type {
    Deal,
    Note,
    Owner,
    Contact,
    Company,
    Pipeline,
    AccountInto,
    CallActivity,
    EmailActivity,
    PropertyMeta,
} from "../../services/hubspot/types";

type Props = {
    contact: Contact["properties"],
    owners: Record<Owner["id"], Owner>,
    companies: Array<Company["properties"]>,
    deals: Array<Deal["properties"]>,
    notes: Array<Note["properties"]>,
    callActivities: Array<CallActivity["properties"]>,
    emailActivities: Array<EmailActivity["properties"]>,
    accountInfo?: AccountInto,
    dealPipelines: Record<Pipeline["id"], Pipeline>,
    onCreateNote: () => void,
    onCreateActivity: () => void,
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
}

const Home: FC<Props> = ({
    deals,
    notes,
    owners,
    contact,
    companies,
    accountInfo,
    callActivities,
    emailActivities,
    dealPipelines,
    onCreateNote,
    onCreateActivity,
    contactMetaMap,
}) => {
    return (
        <>
            <ContactInfo
                contact={contact}
                companies={companies}
                owners={owners}
                accountInfo={accountInfo}
                contactMetaMap={contactMetaMap}
            />
            <Deals
                deals={deals}
                owners={owners}
                accountInfo={accountInfo}
                dealPipelines={dealPipelines}
                contact={contact}
                companies={companies}
            />
            <Notes notes={notes} owners={owners} onCreateNote={onCreateNote} />
            <Activities
                calls={callActivities}
                emails={emailActivities}
                accountInfo={accountInfo}
                contactId={contact?.hs_object_id}
                onCreateActivity={onCreateActivity}
            />
        </>
    );
};

export { Home };
