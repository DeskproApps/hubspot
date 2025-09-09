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
import { LogoutEventListener } from "./components";

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
              <Route path="/login" element={<LoginPage />} />

              <Route path="/admin">
                <Route path="mapping">
                  <Route path="contact" element={<ContactMappingPage />} />
                  <Route path="deal" element={<DealMappingPage />} />
                </Route>

                <Route path="callback" element={<AdminCallbackPage />} />
              </Route>

              <Route element={<LogoutEventListener />}>
                {/* Routes that require authentication (pretty much all routes besides login) should go here. */}
                <Route index element={<LoadingAppPage />} />

                <Route path="/home" element={<HomePage />} />
                <Route path="/link" element={<LinkPage />} />
                <Route path="/note/create" element={<CreateNotePage />} />
                <Route path="/activity/create" element={<CreateActivityPage />} />

                <Route path="/deal">
                  <Route path="create" element={<CreateDealPage />} />
                  <Route path="update/:dealId" element={<UpdateDealPage />} />
                  <Route path=":dealId" element={<DealPage />} />
                </Route>

                <Route path="/contacts">
                  <Route path="create" element={<CreateContactPage />} />
                  <Route path=":contactId" element={<ViewContactPage />} />
                  <Route path="activities" element={<ActivityPage />} />
                  <Route path="edit/:contactId" element={<UpdateContactPage />} />
                </Route>

                <Route path="/companies">
                  <Route path="link" element={<LinkCompanyPage />} />
                  <Route path=":companyId" element={<ViewCompanyPage />} />
                  <Route index element={<CompanyIndexPage />} />
                </Route>
              </Route>

            </Routes>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
}

export default App;