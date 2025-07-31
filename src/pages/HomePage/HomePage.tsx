import { Home } from "../../components/Home";
import { Data, Settings } from "../../types";
import { useCallback, useEffect } from "react";
import { useLoadHomeDeps } from "./hooks";
import { useNavigate } from "react-router-dom";
import { useSetAppTitle } from "../../hooks";
import { LoadingSpinner, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useReplyBox } from "../../hooks/useReplyBox";

const HomePage = () => {
    const navigate = useNavigate();
    const {
        isLoading,
        contact,
        companies,
        deals,
        notes,
        emailActivities,
        callActivities,
        accountInfo,
        owners,
        contactMetaMap,
        dealMetaMap,
    } = useLoadHomeDeps();
    const { context } = useDeskproLatestAppContext<Data, Settings>();
    const { setSelectionState } = useReplyBox();

    const contactId = contact?.hs_object_id;
    const isUsingOAuth = context?.settings.use_api_token === false || context?.settings.use_advanced_connect === false;
    const ticketID = context?.data?.ticket?.id;

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
            }, ...(isUsingOAuth
                ? [
                    {
                        title: "Logout",
                        payload: { type: "logout" },
                    },
                ]
                : [])],
        });
    }, [contactId]);

    const onCreateNote = useCallback(() => {
        if (contactId) {
            navigate({
                pathname: `/note/create`,
                search: `?contactId=${contactId}`
            });
        }
    }, [navigate, contactId]);

    const onCreateActivity = useCallback(() => {
        if (contactId) {
            navigate({
                pathname: `/activity/create`,
                search: `?contactId=${contactId}`
            });
        }
    }, [navigate, contactId]);

    useEffect(() => {
        if (contactId) {
            void setSelectionState(contactId, true, 'note');
            void setSelectionState(contactId, true, 'email');
        };
    }, [contactId, setSelectionState, ticketID]);

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <Home
            owners={owners}
            contact={contact}
            companies={companies}
            deals={deals}
            notes={notes}
            emailActivities={emailActivities}
            callActivities={callActivities}
            accountInfo={accountInfo}
            onCreateNote={onCreateNote}
            onCreateActivity={onCreateActivity}
            contactMetaMap={contactMetaMap}
            dealMetaMap={dealMetaMap}
        />
    );
};

export { HomePage };