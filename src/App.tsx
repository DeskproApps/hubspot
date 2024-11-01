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
import { useUnlinkContact } from "./hooks";
import { isNavigatePayload, isUnlinkPayload } from "./utils";
import {
    LinkPage,
    HomePage,
    DealPage,
    ActivityPage,
    CreateDealPage,
    CreateNotePage,
    UpdateDealPage,
    LoadingAppPage,
    ViewContactPage,
    DealMappingPage,
    UpdateContactPage,
    CreateContactPage,
    CreateActivityPage,
    ContactMappingPage,
} from "./pages";
import { ErrorFallback } from "./components/common";
import type { EventPayload } from "./types";

function App() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { unlinkContact, isLoading } = useUnlinkContact();

    useDeskproAppEvents({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent: (_, __, payload: EventPayload) => {
            match(payload.type)
                .with("changePage", () => {
                    isNavigatePayload(payload) && navigate(payload.path);
                })
                .with("unlink", () => {
                    isUnlinkPayload(payload) && unlinkContact(payload.contactId);
                })
                .otherwise(() => {});
        },
    }, [client, unlinkContact, navigate]);

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
                            <Route index element={<LoadingAppPage/>} />
                        </Routes>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </Suspense>
    );
}

export default App;
