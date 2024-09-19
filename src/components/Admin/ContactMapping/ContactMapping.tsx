import { BaseContainer, StructureBuilder } from "../../common";
import type { FC } from "react";

type Props = {
    properties: string[];
    structure: string[][];
    onChange: (structure: string[][]) => void;
};

const ContactMapping: FC<Props> = ({ structure, properties, onChange }) => {
    return (
        <BaseContainer>
            <StructureBuilder structure={structure} items={properties} onChange={onChange}/>
        </BaseContainer>
    );
};

export { ContactMapping };
