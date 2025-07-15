import { ActivityPage, AdminCallbackPage, ContactMappingPage, CreateActivityPage, CreateContactPage, CreateDealPage, CreateNotePage, DealMappingPage, DealPage, HomePage, LinkPage, LoadingAppPage, LoginPage, UpdateContactPage, UpdateDealPage, ViewContactPage } from "./pages";
import { ErrorFallback } from "./components/common";
import { isNavigatePayload, isUnlinkCompanyPayload, isUnlinkPayload } from "./utils";
import { LoadingSpinner, useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { match } from "ts-pattern";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { useLogout, useUnlinkCompany, useUnlinkContact } from "./hooks";
import type { EventPayload, Settings } from "./types";
import { ErrorBoundary } from "@sentry/react";
import ViewCompanyPage from "./pages/companies/ViewCompanyPage/ViewCompanyPage";
import CompanyIndexPage from "./pages/companies/CompanyIndexPage/CompanyIndexPage";
import LinkCompanyPage from "./pages/companies/LinkCompanyPage/LinkCompanyPage";

function App() {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<unknown, Settings>()
  const { unlinkContact, isLoading } = useUnlinkContact();
  const navigate = useNavigate();
  const { logoutActiveUser } = useLogout()
  const { unlinkCompany } = useUnlinkCompany();

  const isUsingOAuth = context?.settings.use_api_token === false || context?.settings.use_advanced_connect === false;

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
        .with("unlink-company", () => {
          isUnlinkCompanyPayload(payload) && unlinkCompany(payload.companyID);
        })
        .with("logout", () => {
          if (isUsingOAuth) {
            logoutActiveUser()
          }
        })
        .otherwise(() => { });
    },
  }, [client, unlinkContact, navigate, unlinkCompany, logoutActiveUser, isUsingOAuth]);

  if (!client || isLoading) {
    return (<LoadingSpinner />);
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} fallback={ErrorFallback}>
            <Routes>
              <Route path="/admin/mapping/contact" element={<ContactMappingPage />} />
              <Route path="/admin/mapping/deal" element={<DealMappingPage />} />
              <Route path="/admin/callback" element={<AdminCallbackPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/link" element={<LinkPage />} />
              <Route path="/deal/create" element={<CreateDealPage />} />
              <Route path="/deal/update/:dealId" element={<UpdateDealPage />} />
              <Route path="/deal/:dealId" element={<DealPage />} />
              <Route path="/contacts/create" element={<CreateContactPage />} />
              <Route path="/contacts/:contactId" element={<ViewContactPage />} />
              <Route path="/contacts/edit/:contactId" element={<UpdateContactPage />} />
              <Route path="/contacts/activities" element={<ActivityPage />} />
              <Route path="/note/create" element={<CreateNotePage />} />
              <Route path="/activity/create" element={<CreateActivityPage />} />
              <Route path="/companies">
                <Route path="link" element={<LinkCompanyPage />} />
                <Route path=":companyId" element={<ViewCompanyPage />} />
                <Route index element={<CompanyIndexPage />} />
              </Route>
              <Route index element={<LoadingAppPage />} />
            </Routes>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
}

export default App;