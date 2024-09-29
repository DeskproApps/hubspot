import { Tags } from "../../common";
import type { FC } from "react";
import type { PropertyMeta } from "../../../services/hubspot/types";

type Props = {
    meta: PropertyMeta;
    value: string;
};

const MultipleCheckboxesBlock: FC<Props> = ({ value }) => {
    const labels = `${value}`.split(";");

    return (
        <Tags tags={labels} />
    );
};

export { MultipleCheckboxesBlock };
