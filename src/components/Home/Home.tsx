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
    onCreateNote: () => void,
    onCreateActivity: () => void,
    contactMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
    dealMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
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
    onCreateNote,
    onCreateActivity,
    contactMetaMap,
    dealMetaMap,
}) => {
    return (
        <>
            <ContactInfo
                contact={contact}
                accountInfo={accountInfo}
                contactMetaMap={contactMetaMap}
            />
            <Deals
                deals={deals}
                accountInfo={accountInfo}
                contact={contact}
                companies={companies}
                dealMetaMap={dealMetaMap}
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
