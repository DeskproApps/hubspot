import { FC } from "react";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Label, Input, IconButton } from "@deskpro/deskpro-ui";
import { Props } from "./types";

const InputSearch: FC<Props> = ({ value, onChange, onClear }) => (
    <Label style={{ margin: "14px 0 11px" }}>
        <Input
            value={value}
            onChange={onChange}
            leftIcon={faSearch}
            rightIcon={(
                <IconButton icon={faTimes} minimal onClick={onClear} />
            )}
        />
    </Label>
);

export { InputSearch };
