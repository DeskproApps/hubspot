import { FC } from "react";
import { ContactInfo } from "./ContactInfo";
import { Deals } from "./Deals";
import { Notes } from "./Notes";
import { Activities } from "./Activities";
import type { Contact, Company, Owner } from "../../services/hubspot/types";

type Props = {
    contact: Contact,
    companies: Array<Company["properties"]>,
    owner: Owner,
}

const Home: FC<Props> = ({ contact, companies, owner }) => {
    return (
        <>
            <ContactInfo contact={contact.properties} companies={companies} owner={owner} />
            <Deals {...contact.properties} />
            <Notes {...contact.properties} />
            <Activities {...contact.properties} />
        </>
    );
};

export { Home };
