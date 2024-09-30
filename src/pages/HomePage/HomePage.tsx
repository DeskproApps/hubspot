import { useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
} from "@deskpro/app-sdk";
import { useLoadHomeDeps } from "./hooks";
import { useSetAppTitle } from "../../hooks";
import { Home } from "../../components/Home";

const HomePage = () => {
    const navigate = useNavigate();
    const {
        isLoading,
        contact,
        companies,
        deals,
        dealPipelines,
        notes,
        emailActivities,
        callActivities,
        accountInfo,
        owners,
        contactMetaMap,
    } = useLoadHomeDeps();
    const contactId = contact?.hs_object_id;

    useSetAppTitle("Contact");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("menu", {
            type: "menu",
            items: [{
                title: "Unlink contact",
                payload: { type: "unlink", contactId },
            }],
        });
    }, [contactId]);

    const onCreateNote = useCallback(() => {
        if (contactId) {
            navigate({
                pathname: `/note/create`,
                search: `?${createSearchParams({ contactId })}`
            });
        }
    }, [navigate, contactId]);

    const onCreateActivity = useCallback(() => {
        if (contactId) {
            navigate({
                pathname: `/activity/create`,
                search: `?${createSearchParams({ contactId })}`
            });
        }
    }, [navigate, contactId]);

    if (isLoading) {
        return <LoadingSpinner/>
    }

    return (
        <Home
            owners={owners}
            contact={contact}
            companies={companies}
            deals={deals}
            dealPipelines={dealPipelines}
            notes={notes}
            emailActivities={emailActivities}
            callActivities={callActivities}
            accountInfo={accountInfo}
            onCreateNote={onCreateNote}
            onCreateActivity={onCreateActivity}
            contactMetaMap={contactMetaMap}
        />
    );
};

export { HomePage };
