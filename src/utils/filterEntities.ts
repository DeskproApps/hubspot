import { UseQueryResult } from "react-query/types/react/types";
import {
    Deal,
    Note,
    Company,
    CallActivity,
    EmailActivity,
} from "../services/hubspot/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[]): Array<any> => {
    return entities?.filter((entity) => (entity.isFetched && entity.isSuccess))
        .map((entity) => (entity as { data: Company|Deal|Note|EmailActivity|CallActivity }).data.properties);
}

export { filterEntities };
