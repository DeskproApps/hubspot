import { FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import capitalize from "lodash/capitalize";
import {
    LoadingSpinner,
    useDeskproElements,
} from "@deskpro/app-sdk";
import { useSetAppTitle, useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { getActivityService } from "../services/hubspot";
import {  Activities} from "../components/Activities";

const getActivityQueryKey = (type: string | null): string | undefined => {
    if (!type) {
        return;
    }

    return type === "email" ? QueryKey.EMAIL_ACTIVITIES : QueryKey.CALL_ACTIVITIES;
};

const ActivitiesPage: FC = () => {
    const location = useLocation();
    const queryParams = useMemo(() => (new URLSearchParams(location.search)), [location.search]);

    const type = queryParams.get("type");
    const activityId = queryParams.get("activityId");
    const activityKey = getActivityQueryKey(queryParams.get("type"));

    const { data, isFetched, isSuccess } = useQueryWithClient(
        [activityKey, activityId],
        (client) => getActivityService(client, type, activityId),
        { enabled: !!activityKey || !!type && !!activityId }
    );

    useSetAppTitle(!type ? "" : `${capitalize(type)} details`);

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("menu");
        registerElement("home", { type: "home_button", payload: { type: "changePage", path: `/home` }});
    });

    if (!data || !isFetched || !isSuccess) {
        return (<LoadingSpinner/>);
    }

    return (
        <Activities activity={data}/>
    );
};

export { ActivitiesPage };
