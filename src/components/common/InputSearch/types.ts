import { InputProps } from "@deskpro/deskpro-ui";

export type Props = {
    value: string,
    onClear: () => void,
    onChange: InputProps['onChange'],
};
