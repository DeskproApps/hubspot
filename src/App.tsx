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
    ActivityPage,
    CreateDealPage,
    CreateNotePage,
    UpdateDealPage,
    ViewContactPage,
    DealMappingPage,
    UpdateContactPage,
    CreateContactPage,
    CreateActivityPage,
    ContactMappingPage,
} from "./pages";
import { ErrorFallback } from "./components/common";
import type { EventsPayload } from "./types";

function App() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { isLoading, unlinkContactFn } = useLinkUnlinkNote();
    const { unlinkContact } = useUnlinkContact();

    useDeskproAppEvents({
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
                    <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                        <Routes>
                            <Route path="/admin/mapping/contact" element={<ContactMappingPage/>} />
                            <Route path="/admin/mapping/deal" element={<DealMappingPage/>} />
                            <Route path="/home" element={<HomePage/>} />
                            <Route path="/link" element={<LinkPage/>} />
                            <Route path="/deal/create" element={<CreateDealPage/>} />
                            <Route path="/deal/update/:dealId" element={<UpdateDealPage/>} />
                            <Route path="/deal/:dealId" element={<DealPage/>} />
                            <Route path="/contacts/create" element={<CreateContactPage/>} />
                            <Route path="/contacts/:contactId" element={<ViewContactPage/>} />
                            <Route path="/contacts/edit/:contactId" element={<UpdateContactPage/>} />
                            <Route path="/contacts/activities" element={<ActivityPage/>} />
                            <Route path="/note/create" element={<CreateNotePage/>} />
                            <Route path="/activity/create" element={<CreateActivityPage/>} />
                            <Route index element={<Main/>} />
                        </Routes>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </Suspense>
    );
}

export default App;
