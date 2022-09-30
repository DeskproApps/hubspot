import { FC } from "react";
import { ContactInfo } from "./ContactInfo";
import { Deals } from "./Deals";
import { Notes } from "./Notes";
import { Activities } from "./Activities";

const Home: FC = () => {
    return (
        <>
            <ContactInfo/>
            <Deals/>
            <Notes/>
            <Activities/>
        </>
    );
};

export { Home };
