import get from "lodash/get";
import { UseQueryResult } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[], path: string[] = ["data", "properties"]): any[] => {
    return entities
        ?.filter((entity) => (entity.isFetched && entity.isSuccess))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map((entity) => get(entity, path))
}

export { filterEntities };
