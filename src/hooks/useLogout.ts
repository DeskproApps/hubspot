import { placeholders } from "../services/hubspot/constants";
import { useCallback } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    const logoutActiveUser = useCallback(() => {
        if (!client) {
            return;
        }

        client.setBadgeCount(0)

        client.deleteUserState(placeholders.OAUTH2_ACCESS_TOKEN_PATH)
            .catch(() => { })
            .finally(() => {
                navigate("/login");
            });
    }, [client, navigate]);

    return { logoutActiveUser };
}