import { UseQueryResult } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterEntities = (entities: UseQueryResult[], path: string[] = ["data", "properties"]): any[] => {
    return entities
        ?.filter((entity) => (entity.isFetched && entity.isSuccess))
        .map(entity => {
            let result: unknown = entity;

            for (const key of path) {
                if (typeof result !== "object" || result === null) {
                    return;
                };

                result = (result as Record<string, unknown>)[key];
            };

            return result;
        });
}

export { filterEntities };