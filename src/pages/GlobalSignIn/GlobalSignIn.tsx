import { FC } from "react";
import isEmpty from "lodash/isEmpty";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { AnchorButton } from "@deskpro/deskpro-ui";
import {
    P1,
    P5,
    H2,
    Stack,
    Button,
    useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { useGlobalSignIn } from "./useGlobalSignIn";
import { Loading, OverflowText } from "../../components/common";

const GlobalSignInContainerCallback = styled(Stack)`
    margin: 3px 0 0 0;
    padding: 5px 5px 6px 10px;
    font-family: "Noto Sans", sans-serif;
    border: 1px solid ${({ theme }) => theme.colors.brandShade40};
    border-radius: 4px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.grey100}
`;

const CopyButton = styled(Button)`
    min-width: 85px;
    justify-content: center;
`;

const Description = styled(P1)`
    margin-bottom: 16px;
    margin-top: 8px;
    color: ${({ theme }) => theme.colors.grey80};
`;

const CallbackUrl = ({ url }: { url: string }) => {
    return (
        <>
            <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
            <GlobalSignInContainerCallback justify="space-between" align="center">
                <OverflowText as={P5}>{url}</OverflowText>
                <CopyToClipboard text={url}>
                    <CopyButton text="Copy" icon={faCopy} intent="secondary" />
                </CopyToClipboard>
            </GlobalSignInContainerCallback>
            <Description>The callback URL will be required during HubSpot app setup</Description>
        </>
    );
};

const Login = ({ url, isLoading, signIn, cancel }: { url: string, isLoading: boolean, signIn: () => void, cancel: () => void }) => {
    return (
        <>
            <P1 style={{ marginBottom: "6px" }}>
                This HubSpot user account will be used by all Deskpro agents
            </P1>
            <AnchorButton
                href={url}
                target="_blank"
                text="Sign-In"
                icon={faSignIn}
                intent="secondary"
                size="small"
                disabled={!url}
                loading={isLoading}
                onClick={signIn}
            />
            {isLoading && (
                <Button
                    onClick={cancel}
                    text="Cancel"
                    intent="secondary"
                    style={{ marginLeft: "6px" }}
                />
            )}
        </>
    );
};

const Logout = ({ signOut, user }: { user: any, signOut: () => void }) => {
    const { theme } = useDeskproAppTheme();
    return (
        <>
            <P1 style={{ marginBottom: "6px" }}>
                Signed-in as <span style={{ color: theme.colors.grey100 }}>{user.name} {user.email ? `<${user.email}>` : ""}</span>
            </P1>
            <Button text="Sign-out" intent="secondary" icon={faSignOut} onClick={signOut} />
        </>
    );
};

const GlobalSignIn: FC = () => {
    const {
        callbackUrl,
        user,
        oAuthUrl,
        isLoading,
        isBlocking,
        cancelLoading,
        signIn,
        signOut,
    } = useGlobalSignIn();

    if (isBlocking) {
        return (<Loading/>);
    }

    return (
        <>
            {callbackUrl && <CallbackUrl url={callbackUrl}/>}
            {!isEmpty(user)
                ? (<Logout user={user} signOut={signOut} />)
                : (<Login url={oAuthUrl || ""} isLoading={isLoading} signIn={signIn} cancel={cancelLoading}/>)
            }
        </>
    );
}

export { GlobalSignIn };
