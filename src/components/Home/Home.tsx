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
} from "../../services/hubspot/types";
import {DealPipeline} from "../../types";

type Props = {
    contact: Contact["properties"];
    contactOwner?: Owner;
    dealOwners: Record<Owner["id"], Owner>;
    companies: Array<Company["properties"]>;
    deals: Array<Deal["properties"]>;
    notes: Array<Note["properties"]>;
    noteOwners: Record<Owner["id"], Owner>;
    callActivities: Array<CallActivity["properties"]>;
    emailActivities: Array<EmailActivity["properties"]>;
    accountInfo?: AccountInto;
    dealPipelines: DealPipeline[];
}

const Home: FC<Props> = ({
    deals,
    notes,
    contact,
    companies,
    dealOwners,
    noteOwners,
    accountInfo,
    contactOwner,
    callActivities,
    emailActivities,
    dealPipelines,
}) => {
    return (
        <>
            <ContactInfo contact={contact} companies={companies} owner={contactOwner} />
            <Deals deals={deals} owners={dealOwners} accountInfo={accountInfo} dealPipelines={dealPipelines} />
            {notes.length > 0 && <Notes notes={notes} owners={noteOwners} />}
            {(callActivities.length > 0 || emailActivities.length > 0) && <Activities calls={callActivities} emails={emailActivities} />}
        </>
    );
};

export { Home };
