import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui"
import { ErrorBlock } from "../../components/common"
import { FC, useEffect } from "react"
import { useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk"
import useLogin from "./useLogin"
import { useLogoutEvent } from "../../hooks"

const LoginPage: FC = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    useInitialisedDeskproAppClient((client) => {
        client.setTitle("Login")
    }, [])

    const { onSignIn, authUrl, isLoading, error } = useLogin();

    const { logoutEvent, setLogoutEvent } = useLogoutEvent()

    useEffect(() => {
        if (logoutEvent) {
            setLogoutEvent(undefined)
        }

    }, [logoutEvent, setLogoutEvent])


    return (
        <Stack padding={12} vertical gap={12} role="alert">
            <H3>Log into your HubSpot account.</H3>
            <AnchorButton
                disabled={!authUrl || isLoading}
                href={authUrl || "#"}
                loading={isLoading}
                onClick={onSignIn}
                target={"_blank"}
                text={"Log In"}
            />

            {error && (<div style={{ width: "100%", padding: 12, boxSizing: "border-box" }} >
                <ErrorBlock texts={[error]} />
            </div>)}
        </Stack>
    )
}

export { LoginPage }