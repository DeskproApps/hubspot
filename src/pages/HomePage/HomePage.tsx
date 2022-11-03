import { useState, useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
    Context,
    LoadingSpinner,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityContactList } from "../../services/entityAssociation";
import { useLoadHomeDeps } from "./hooks";
import { useSetAppTitle } from "../../hooks";
import { Home } from "../../components/Home";
import type { UserContext, ContextData } from "../../types";
import type { Contact } from "../../services/hubspot/types";

const HomePage = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: UserContext };
    const [contactId, setContactId] = useState<Contact["id"]|null>(null);
    const {
        isLoading,
        contact,
        contactOwner,
        companies,
        deals,
        dealOwners,
        dealPipelines,
        notes,
        noteOwners,
        emailActivities,
        callActivities,
        accountInfo,
    } = useLoadHomeDeps(contactId);

    const userId = (context as Context<ContextData>)?.data?.user.id;

    useSetAppTitle("Contact");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("refresh", { type: "refresh_button" });
        registerElement("edit", {
            type: "edit_button",
            payload: { type: "changePage", path: `/contacts/${contactId}` },
        });
        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Unlink contact",
                payload: { type: "unlink", userId, contactId },
            }],
        });
    }, [userId, contactId]);

    useInitialisedDeskproAppClient((client) => {
        if (!userId) {
            return;
        }

        getEntityContactList(client, userId)
            .then((contactIds) => {
                if (contactIds.length !== 0) {
                    setContactId(contactIds[0]);
                }
            })
    }, [userId]);

    const onCreateNote = useCallback(() => {
        if (contactId) {
            navigate({
                pathname: `/note/create`,
                search: `?${createSearchParams({ contactId })}`
            });
        }
    }, [navigate, contactId]);

    if (isLoading) {
        return <LoadingSpinner/>
    }

    return (
        <Home
            contact={contact}
            contactOwner={contactOwner}
            companies={companies}
            deals={deals}
            dealOwners={dealOwners}
            dealPipelines={dealPipelines}
            notes={notes}
            noteOwners={noteOwners}
            emailActivities={emailActivities}
            callActivities={callActivities}
            accountInfo={accountInfo}
            onCreateNote={onCreateNote}
        />
    );
};

export { HomePage };
