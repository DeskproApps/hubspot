import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { QueryKey } from "../query";
import { useQueryWithClient } from "../hooks";
import { getCurrentUserInfoService } from "../services/hubspot";

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    /*const currentUser = useQueryWithClient(
        [QueryKey.CURRENT_ACCOUNT],
        (client) => getCurrentUserInfoService(client),
        {
            retry: 0,
            onError: (err) => {
                console.log(">>> onError:", err);
            },
            onSuccess: (res) => {
                console.log(">>> onSuccess:", res);
                if (res?.status === "error" && res?.category === "INVALID_AUTHENTICATION") {
                    navigate("/log-in");
                }
            }
        }
    );*/

    useEffect(() => {
        if (!client) {
            return;
        }

        getCurrentUserInfoService(client)
            .then((res) => console.log(">>> current:then:", res))
            .catch((err) => console.log(">>> current:catch:", err))
    }, [client]);

    return (<LoadingSpinner/>);
};

export { Main };
