import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { checkAuthService } from "../services/hubspot";
import { ErrorBlock, BaseContainer } from "../components/common";

const Main = () => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState<boolean|null>(null);

    useInitialisedDeskproAppClient((client) => {
        checkAuthService(client)
            .then((isAuth) => {
                if (isAuth) {
                    navigate("/home");
                } else {
                    setIsAuth(false);
                }
            })
    });

    if (isAuth === false) {
        return (
            <BaseContainer>
                <ErrorBlock
                    text="Go back to the admin settings form for the app and re-auth from there"
                />
            </BaseContainer>
        );
    }

    return (<LoadingSpinner/>);
};

export { Main };
