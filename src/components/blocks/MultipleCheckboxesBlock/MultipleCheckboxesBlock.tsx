import { Tags } from "../../common";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const MultipleCheckboxesBlock: FC<Props> = ({ value }) => {
    const labels = `${value}`.split(";");

    return (
        <Tags tags={labels} />
    );
};

export { MultipleCheckboxesBlock };
