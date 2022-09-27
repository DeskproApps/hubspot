import { Suspense, useCallback } from "react";
import { match } from "ts-pattern";
import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import {
    Stack,
    Button,
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { deleteEntityContactService } from "./services/entityAssociation";
import { Main } from "./pages/Main";
import { GlobalSignIn } from "./pages/GlobalSignIn";
import { Home } from "./pages/Home";
import { Link } from "./pages/Link";
import type { EventsPayload } from "./types";

function App() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    const unlink = useCallback((userId, contactId) => {
        if (client && userId && contactId) {
            deleteEntityContactService(client, userId, contactId)
                .then((isSuccess) => {
                    if (isSuccess) {
                        navigate("/link");
                    }
                })
                .catch((err) => {
                    console.log(">>> delete:catch:", err);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client]);

    useDeskproElements(({ registerElement }) => {
        registerElement("refreshButton", { type: "refresh_button" });
    });

    useDeskproAppEvents({
        onElementEvent: (id, type, payload: EventsPayload) => {
            match(payload)
                .with({ type: "unlink" }, () => {
                    unlink(payload?.userId, payload?.contactId)
                })
                .run();
        },
    }, [client]);

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary
                        onReset={reset}
                        fallbackRender={({ resetErrorBoundary }) => (
                            <Stack gap={6} vertical style={{ padding: "8px" }}>
                                There was an error!
                                <Button
                                    text="Reload"
                                    icon={faRefresh}
                                    intent="secondary"
                                    onClick={() => resetErrorBoundary()}
                                />
                            </Stack>
                        )}
                    >
                        <Routes>
                            <Route path="/">
                                <Route path="admin">
                                    <Route path="global-sign-in" element={<GlobalSignIn/>} />
                                </Route>
                            </Route>
                            <Route path="home" element={<Home/>} />
                            <Route path="link" element={<Link/>} />
                            <Route index element={<Main/>} />
                        </Routes>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </Suspense>
    );
}

export default App;
