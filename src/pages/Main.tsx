import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { checkAuthService } from "../services/hubspot";
import { ErrorBlock, BaseContainer } from "../components/common";
import { useCheckLinkedContact } from "../hooks";

const Main = () => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState<boolean|null>(null);

    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    useCheckLinkedContact(
        isAuth,
        useCallback(() => navigate("/home"), [navigate]),
        useCallback(() => navigate("/link"), [navigate]),
    );

    useInitialisedDeskproAppClient((client) => {
        checkAuthService(client).then(setIsAuth)
    });

    if (isAuth === false) {
        return (
            <BaseContainer>
                <ErrorBlock
                    text="Access token invalid, please fix in admin settings"
                />
                <br/><br/><br/><br/><br/>
            </BaseContainer>
        );
    }

    return (<LoadingSpinner/>);
};

export { Main };
