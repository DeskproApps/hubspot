import { FC } from "react";
import { ContactInfo } from "./ContactInfo";
import { Deals } from "./Deals";
import { Notes } from "./Notes";
import { Activities } from "./Activities";
import type { Contact, Company, Owner, Deal } from "../../services/hubspot/types";

type Props = {
    contact: Contact,
    contactOwner: Owner,
    dealOwners: Record<Owner["id"], Owner>,
    companies: Array<Company["properties"]>,
    deals: Array<Deal["properties"]>
}

const Home: FC<Props> = ({ contact, companies, contactOwner, deals, dealOwners }) => {
    return (
        <>
            <ContactInfo contact={contact.properties} companies={companies} owner={contactOwner} />
            <Deals deals={deals} owners={dealOwners} />
            <Notes {...contact.properties} />
            <Activities {...contact.properties} />
        </>
    );
};

export { Home };
