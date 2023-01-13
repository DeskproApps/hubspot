import { Suspense } from "react";
import { match } from "ts-pattern";
import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import {
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useLinkUnlinkNote, useUnlinkContact } from "./hooks";
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
import { errorFallbackRender } from "./components/common";
import type { EventsPayload } from "./types";

function App() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { isLoading, unlinkContactFn } = useLinkUnlinkNote();
    const { unlinkContact } = useUnlinkContact();

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
                    unlinkContact(payload?.contactId, (contactId) => {
                        unlinkContactFn(contactId).then(() => navigate("/link"))
                    });
                })
                .otherwise(() => {});
        },
    }, [client, unlinkContactFn]);

    if (!client || isLoading) {
        return (<LoadingSpinner/>);
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary onReset={reset} fallbackRender={errorFallbackRender}>
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
                        <br/><br/><br/>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </Suspense>
    );
}

export default App;
