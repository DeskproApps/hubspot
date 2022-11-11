import { Suspense } from "react";
import { match } from "ts-pattern";
import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import {
    IDeskproClient,
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { deleteEntityContact } from "./services/entityAssociation";
import { useLinkUnlinkNote } from "./hooks";
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
import type { EventsPayload, DeskproUser } from "./types";
import type { Contact } from "./services/hubspot/types";

const unlink = (
    client: IDeskproClient|null,
    successFn: (contactId: Contact["id"]) => void,
) => (
    userId: DeskproUser["id"],
    contactId: Contact["id"],
) => {
    if (client && userId && contactId) {
        deleteEntityContact(client, userId, contactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    successFn(contactId);
                } else {
                    return Promise.resolve();
                }
            })
            .catch(() => {});
    }
};

function App() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { isLoading, unlinkContactFn } = useLinkUnlinkNote();

    const unlinkContact = unlink(client, (contactId) => {
        unlinkContactFn(contactId).then(() => navigate("/link"))
    });

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
    }, [client, unlinkContactFn]);

    if (!client || isLoading) {
        return (<LoadingSpinner/>);
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <QueryErrorResetBoundary>
                {({ reset }) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return (<ErrorBoundary onReset={reset} fallbackRender={errorFallbackRender}>
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
