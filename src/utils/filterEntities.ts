import { get } from "lodash-es";
import { UseQueryResult } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[], path: string[] = ["data", "properties"]): any[] => {
    return entities
        ?.filter((entity) => (entity.isFetched && entity.isSuccess))
        // re-introducing `lodash-es/get` as native implementation for `_.get`'s full robustness (dynamic paths, edge cases) proved overly complex, whereas `lodash-es` is tree-shakeable and efficient
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map((entity) => get(entity, path))
}

export { filterEntities };