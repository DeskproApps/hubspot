import get from "lodash/get";
import { UseQueryResult } from "react-query/types/react/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[], path: string[] = ["data", "properties"]): any[] => {
    return entities?.filter((entity) => (entity.isFetched && entity.isSuccess))
        .map((entity) => get(entity, path))
}

export { filterEntities };
