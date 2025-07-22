import { useEffect } from "react";
import { getFullName, getOption, noOwnerOption } from "../utils";
import type { Option, UseSetStateFn } from "../types";
import type { Owner } from "../services/hubspot/types";

type OwnerOptions = Array<Option<Owner["id"]>>;

const useOwnerOptions = (
    owners: Owner[],
    setStateFn: UseSetStateFn<OwnerOptions>,
): void => {
    useEffect(() => {
        let options = [noOwnerOption];

        if (Array.isArray(owners) && owners.length > 0) {
            options = options.concat(
                owners.map((owner) => getOption(owner.id, getFullName(owner))),
            );
        }

        setStateFn(options);
    }, [owners, setStateFn]);
};

export { useOwnerOptions };