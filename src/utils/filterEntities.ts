import { UseQueryResult } from "@tanstack/react-query";
import { get } from "./get";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[], path: string[] = ["data", "properties"]): any[] => {
    return entities
        ?.filter((entity) => (entity.isFetched && entity.isSuccess))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map((entity) => get(entity, path))
}

export { filterEntities };