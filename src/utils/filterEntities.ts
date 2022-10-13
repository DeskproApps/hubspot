import {UseQueryResult} from "react-query/types/react/types";
import {CallActivity, Company, Deal, EmailActivity, Note} from "../services/hubspot/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[]): any[] => {
    return entities?.filter((entity) => (entity.isFetched && entity.isSuccess))
        .map((entity) => (entity as { data: Company|Deal|Note|EmailActivity|CallActivity }).data.properties);
}

export { filterEntities };
