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
} from "../../services/hubspot/types";

type Props = {
    contact: Contact,
    contactOwner: Owner,
    dealOwners: Record<Owner["id"], Owner>,
    companies: Array<Company["properties"]>,
    deals: Array<Deal["properties"]>,
    notes: Array<Note["properties"]>,
    noteOwners: Record<Note["id"], Note>,
}

const Home: FC<Props> = ({
    deals,
    notes,
    contact,
    companies,
    dealOwners,
    noteOwners,
    contactOwner,
}) => {
    return (
        <>
            <ContactInfo contact={contact.properties} companies={companies} owner={contactOwner} />
            <Deals deals={deals} owners={dealOwners} />
            <Notes notes={notes} owners={noteOwners} />
            <Activities {...contact.properties} />
        </>
    );
};

export { Home };
