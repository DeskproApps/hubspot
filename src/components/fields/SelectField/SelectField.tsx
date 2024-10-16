import { useMemo } from "react";
import { Select, Member } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../../hooks";
import { getOwnersService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { getOption, getFullName } from "../../../utils";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const SelectField: FC<FieldProps> = ({ meta, formControl }) => {
    const isOwner = meta.referencedObjectType === "OWNER"; 

    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
        { enabled: isOwner },
    );

    const options = useMemo(() => {
        return isOwner
            ? (owners.data?.results ?? []).map((owmer) => {
                return getOption(owmer.id, <Member name={getFullName(owmer)} />, getFullName(owmer));
            })
            : meta.options?.map((o) => getOption(o.value, o.label));
    }, [isOwner, owners.data?.results, meta.options]);

    return (
        <Select
            id={meta.name}
            initValue={`${formControl.field.value}` || ""}
            options={options}
            onChange={formControl.field.onChange}
        />
    );
};

export { SelectField };
