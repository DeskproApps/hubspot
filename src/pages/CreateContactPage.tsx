import {FC, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import { BaseContainer } from "../components/common";
import { ContactForm } from "../components";

const CreateContactPage: FC = () => {
    const navigate = useNavigate();

    const onNavigateToLinkContact = useCallback(() => {
        navigate("/link");
    }, [navigate]);

    const onSubmit = () => {
        console.log(">>> onSubmit:");
    };

    const onCancel = () => {
        console.log(">>> onCancel");
    };

    return (
        <BaseContainer>
            <TwoButtonGroup
                selected="two"
                oneLabel="Find contact"
                oneIcon={faSearch}
                oneOnClick={onNavigateToLinkContact}
                twoLabel="Create contact"
                twoIcon={faPlus}
                twoOnClick={() => {}}
            />
            <ContactForm
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </BaseContainer>
    );
};

export { CreateContactPage };
