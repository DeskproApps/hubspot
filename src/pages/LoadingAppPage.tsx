import {  useLinkContact, useLinkUnlinkNote } from "../hooks";
import { checkAuthService } from "../services/hubspot";
import { ContextData, Settings } from "../types";
import { ErrorBlock } from "../components/common";
import { getEntityContactList } from "../services/entityAssociation";
import { LoadingSpinner, useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { tryToLinkAutomatically } from "../utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoadingAppPage = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" });
    });

    const { client } = useDeskproAppClient()
    const { context } = useDeskproLatestAppContext<ContextData, Settings>()

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)

    const navigate = useNavigate();
    const { linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();

    // Determine authentication method from settings
    const isUsingOAuth = context?.settings.use_api_token !== true || context.settings.use_advanced_connect === false
    const user = context?.data?.user

    useInitialisedDeskproAppClient((client) => {
        client.setTitle("HubSpot")

        if (!context || !context?.settings || !user) {
            return
        }

        // Store the authentication method in the user state
        client.setUserState("isUsingOAuth", isUsingOAuth).catch(() => { })

        checkAuthService(client)
            .then(() => {
                setIsAuthenticated(true)
            })
            .catch(() => { })
            .finally(() => {
                setIsFetchingAuth(false)
            })
    }, [context, context?.settings])

    if (!client || !user || isFetchingAuth) {
        return (<LoadingSpinner />)
    }

    if (isAuthenticated) {
        tryToLinkAutomatically(client, user, getContactInfo, linkContactFn)
            .then(() => getEntityContactList(client, user.id))
            .then((entityIds) => navigate(entityIds.length > 0 ? "/home" : "/link"))
            .catch(() => { navigate("/link") });
    } else {

        if (isUsingOAuth) {
            navigate("/login")
        } else {
            // Show error for invalid access tokens (expired or not present)
            return (
                <div style={{ width: "100%", padding: 12, boxSizing: "border-box" }} >
                    <ErrorBlock texts={["Invalid Access Token"]} />
                </div>
            )
        }

    }

    return (
        <LoadingSpinner />
    );
};

export { LoadingAppPage };
