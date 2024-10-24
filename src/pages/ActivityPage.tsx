import { FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import capitalize from "lodash/capitalize";
import get from "lodash/get";
import {
    LoadingSpinner,
    useDeskproElements,
} from "@deskpro/app-sdk";
import {
    useSetAppTitle,
    useQueryWithClient,
    useQueriesWithClient,
} from "../hooks";
import { filterEntities } from "../utils";
import { QueryKey } from "../query";
import {
    getContactService,
    getActivityService,
    getEntityAssocService, getOwnerService,
} from "../services/hubspot";
import { Activity } from "../components/Activity";
import type { Contact } from "../services/hubspot/types";

const getActivityQueryKey = (type: string | null): string | undefined => {
    if (!type) {
        return;
    }

    return type === "email" ? QueryKey.EMAIL_ACTIVITIES : QueryKey.CALL_ACTIVITIES;
};

const ActivityPage: FC = () => {
    const location = useLocation();
    const queryParams = useMemo(() => (new URLSearchParams(location.search)), [location.search]);

    const type = queryParams.get("type") as "email"|"call";
    const activityId = queryParams.get("activityId");
    const activityKey = getActivityQueryKey(queryParams.get("type"));

    const { data, isFetched, isSuccess } = useQueryWithClient(
        [activityKey, activityId],
        (client) => getActivityService(client, type as "email"|"call", activityId as string),
        { enabled: !!activityKey || !!type && !!activityId }
    );

    const contactIds = useQueryWithClient(
        [activityKey, type, activityId, "contact"],
        (client) => getEntityAssocService<string, "call_to_contact">(
            client, type as "emails"|"calls", activityId as string, "contacts"
        ),
        { enabled: !!activityId },
    );

    const contacts = useQueriesWithClient(contactIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.CONTACT, id],
        queryFn: (client) => getContactService(client, id),
        enabled: (contactIds.data?.results.length > 0),
        useErrorBoundary: false,
    })) ?? []);

    const owner = useQueryWithClient(
        [QueryKey.OWNERS, data?.properties?.hubspot_owner_id],
        (client) => getOwnerService(client, data?.properties?.hubspot_owner_id as string),
        {
            enabled: Boolean(get(data, ["properties", "hubspot_owner_id"])),
            useErrorBoundary: false,
        },
    );

    useSetAppTitle(!type ? "" : `${capitalize(type)} details`);

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("home", { type: "home_button", payload: { type: "changePage", path: `/home` }});
    });

    if (!data || !isFetched || !isSuccess) {
        return (<LoadingSpinner/>);
    }

    return (
        <Activity
            type={type}
            owner={owner.data}
            activity={data.properties}
            contacts={filterEntities(contacts) as Array<Contact["properties"]>}
        />
    );
};

export { ActivityPage };
