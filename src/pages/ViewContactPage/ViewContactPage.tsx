import { useParams } from "react-router-dom";
import { useDeskproElements, LoadingSpinner } from "@deskpro/app-sdk";
import { useContact } from "./hooks";
import { ViewContact } from "../../components";
import type { FC } from "react";

const ViewContactPage: FC = () => {
    const { contactId } = useParams();
    const { contact, accountInfo, contactMetaMap, isLoading } = useContact(contactId);

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: `/home` },
        });
        registerElement("edit", {
            type: "edit_button",
            payload: { type: "changePage", path: `/contacts/edit/${contactId}` },
        });
    }, [contactId]);

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <ViewContact
            contact={contact}
            accountInfo={accountInfo}
            contactMetaMap={contactMetaMap}
        />
    );
};

export { ViewContactPage };
