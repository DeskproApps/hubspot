import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import {
    Stack,
    Button,
    LoadingSpinner,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Main } from "./pages/Main";
import { Home } from "./pages/Home";
import { GlobalSignIn } from "./pages/GlobalSignIn/GlobalSignIn";

function App() {
    useInitialisedDeskproAppClient((client) => {
        client?.registerElement("refreshButton", {
            type: "refresh_button"
        });
    });

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary
                        onReset={reset}
                        fallbackRender={({ resetErrorBoundary }) => (
                            <Stack gap={6} vertical style={{ padding: "8px" }}>
                                There was an error!
                                <Button text="Reload" onClick={() => resetErrorBoundary()} icon={faRefresh} intent="secondary" />
                            </Stack>
                        )}
                    >
                        <Routes>
                            <Route path="/">
                                <Route path="home" element={<Home/>} />
                                <Route path="admin">
                                    <Route path="global-sign-in" element={<GlobalSignIn/>} />
                                </Route>
                            </Route>
                            <Route index element={<Main/>} />
                        </Routes>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </Suspense>
    );
}

export default App;
