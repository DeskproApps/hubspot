import { placeholders } from "../services/hubspot/constants";
import { useCallback } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import useLogoutEvent from "./useLogoutEvent";

export function useLogout() {
    const { client } = useDeskproAppClient();
    const { setLogoutEvent } = useLogoutEvent()

    const logoutActiveUser = useCallback(() => {
        if (!client) {
            return;
        }

        client.setBadgeCount(0)

        client.deleteUserState(placeholders.OAUTH2_ACCESS_TOKEN_PATH)
            .then(() => {

                setLogoutEvent(true)
            })
            .catch((e) => {
                const errorMessage = e instanceof Error && e.message.trim() !== "" ? e.message : "Unknown error"

                // eslint-disable-next-line no-console
                console.error(`Error logging out: `, errorMessage)
            })
    }, [client, setLogoutEvent]);

    return { logoutActiveUser };
}