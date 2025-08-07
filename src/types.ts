import type { Contact, Deal, Company } from "./services/hubspot/types";
import type { Dispatch, SetStateAction } from "react";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { IDeskproClient, Context } from "@deskpro/app-sdk";
import type { Layout } from "./components/common/Builder";
import type { To } from "react-router-dom";

/** Common types */

/** An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"` */
export type DateTime = string;

/** Request types */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "PATCH";

export type RequestParams = {
    url: string,
    method?: ApiRequestMethod,
    data?: object,
    headers?: Record<string, string>,
    queryParams?: Record<string, string | number | boolean>,
    entity?: string,
    settings?: Settings;
    idempotencyKey?: string;
};

export type Request = <T = unknown>(
    client: IDeskproClient,
    params: RequestParams,
) => Promise<T>;

export type PreRequestParams = {
    url: string,
    settings: Settings,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>,
    method?: ApiRequestMethod,
};

export type PreInstalledRequest = <T>(
    client: IDeskproClient,
    params: PreRequestParams,
) => Promise<T>;

/** Deskpro types */
export type Data = {
    ticket: {
        id: string
    };
};

export type Settings = {
    api_token?: string;
    default_dont_add_note_when_linking_contact?: boolean;
    mapping_contact?: string;
    mapping_deal?: string;
    use_advanced_connect?: boolean,
    use_api_token?: boolean,
    client_id?: string,
    log_email_as_hubspot_note?: boolean,
    log_note_as_hubspot_note?: boolean
};

export type DeskproUser = {
    emails: string[],
    firstName: string,
    id: string,
    isAgent: boolean,
    isConfirmed: boolean,
    isDisabled: boolean,
    lastName: string,
    name: string,
    primaryEmail: string,
    titlePrefix: string,
    phoneNumbers?: {
        ext: string,
        guessedType: string,
        id: string
        label: string,
        number: string,
    }[],
};

export type DeskproOrganisation = {
  id: string;
  name: string;
  summary: string;
  dateCreated: string;
  customFields: Record<string, unknown>;
}

export type ContextData = {
    user: DeskproUser;
    organisation: DeskproOrganisation;
};

export type UserContext = Context<ContextData, Settings>;

export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

export type UseSetStateFn<T> = Dispatch<SetStateAction<T>>;

export type ContactLayout = {
    home: Layout;
    view: Layout;
};

export type DealLayout = {
    list: Layout;
    view: Layout;
};

export type LayoutType = ContactLayout | DealLayout;

export type NavigateToChangePage = { type: "changePage", path: To };

export type UnlinkPayload = { type: "unlink", contactId: Contact["id"] };

export type UnlinkCompanyPayload = { type: "unlink-company", companyID: Company["id"]};

export type LogoutPayload = { type: "logout" };

export type EventPayload =
  | NavigateToChangePage
  | UnlinkPayload
  | UnlinkCompanyPayload
  | LogoutPayload
  ;

/** HubSpot */
export type EntityMetadata = {
    id: Contact["id"],
    fullName: string,
    phone: Contact["properties"]["phone"],
    email: Contact["properties"]["email"],
    companies: Array<{
        id: Company["id"],
        name: Company["properties"]["name"],
    }>,
    deals: Array<{
        id: Deal["id"],
        name: Deal["properties"]["dealname"],
    }>,
};

export type ContactDeps = {
    contact?: Contact["properties"],
    companies?: Array<Company["properties"]>,
    deals?: Array<Deal["properties"]>,
};
