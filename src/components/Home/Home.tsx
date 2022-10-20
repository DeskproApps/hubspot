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
} from "../../services/hubspot/types";

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
    dealPipelines: Record<Pipeline["id"], Pipeline>;
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
            <ContactInfo contact={contact} companies={companies} owner={contactOwner} accountInfo={accountInfo} />
            <Deals deals={deals} owners={dealOwners} accountInfo={accountInfo} dealPipelines={dealPipelines} />
            <Notes notes={notes} owners={noteOwners} />
            <Activities calls={callActivities} emails={emailActivities} />
        </>
    );
};

export { Home };
