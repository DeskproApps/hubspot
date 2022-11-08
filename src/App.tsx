import { Suspense } from "react";
import { match } from "ts-pattern";
import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import {
    Stack,
    Button,
    IDeskproClient,
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { deleteEntityContact } from "./services/entityAssociation";
import {
    Main,
    LinkPage,
    HomePage,
    DealPage,
    GlobalSignIn,
    ActivityPage,
    CreateDealPage,
    CreateNotePage,
    UpdateDealPage,
    UpdateContactPage,
    CreateContactPage,
    CreateActivityPage,
} from "./pages";
import type { EventsPayload, DeskproUser } from "./types";
import type { Contact } from "./services/hubspot/types";
import type { DeskproError } from "./services/hubspot/baseRequest";

const unlink = (client: IDeskproClient|null, successFn: () => void) => (userId: DeskproUser["id"], contactId: Contact["id"]) => {
    if (client && userId && contactId) {
        deleteEntityContact(client, userId, contactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    successFn();
                }
            })
            .catch(() => {});
    }
};

function App() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const unlinkContact = unlink(client, () => navigate("/link"));

    useDeskproAppEvents({
        onShow: () => {
            client && setTimeout(() => client.resize(), 200);
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent: (id, type, payload: EventsPayload) => {
            match(payload.type)
                .with("changePage", () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    payload?.path && navigate(payload.path);
                })
                .with("unlink", () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    unlinkContact(payload?.userId, payload?.contactId);
                })
                .otherwise(() => {});
        },
    }, [client]);

    if (!client) {
        return (<LoadingSpinner/>);
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
                {({ reset }) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return (<ErrorBoundary
                            onReset={reset}
                            fallbackRender={({ resetErrorBoundary, error }) => {
                                const { code, entity, message: nativeErrorMessage } = error as DeskproError;
                                const message = match(code)
                                    .with(404, () => `Can't find ${entity ? entity : ""}`)
                                    .otherwise(() => "There was an error!");

                                // eslint-disable-next-line no-console
                                console.error(nativeErrorMessage);

                                return (
                                    <Stack gap={6} vertical style={{ padding: "8px" }}>
                                        {message}
                                        <Button text="Reload" icon={faRefresh} intent="secondary" onClick={resetErrorBoundary} />
                                    </Stack>
                                )
                            }}
                        >
                            <Routes>
                                <Route path="/">
                                    <Route path="admin">
                                        <Route path="global-sign-in" element={<GlobalSignIn/>} />
                                    </Route>
                                </Route>
                                <Route path="home" element={<HomePage/>} />
                                <Route path="link" element={<LinkPage/>} />
                                <Route path="deal/create" element={<CreateDealPage/>} />
                                <Route path="deal/update/:dealId" element={<UpdateDealPage/>} />
                                <Route path="deal/:dealId" element={<DealPage/>} />
                                <Route path="contacts/create" element={<CreateContactPage/>} />
                                <Route path="contacts/:contactId" element={<UpdateContactPage/>} />
                                <Route path="contacts/activities" element={<ActivityPage/>} />
                                <Route path="note/create" element={<CreateNotePage/>} />
                                <Route path="activity/create" element={<CreateActivityPage/>} />
                                <Route index element={<Main/>} />
                            </Routes>
                        </ErrorBoundary>
                    )
                }}
            </QueryErrorResetBoundary>
        </Suspense>
    );
}

export default App;
