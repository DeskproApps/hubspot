import { InputProps } from "@deskpro/app-sdk";

export type Props = {
    value: string,
    onClear: () => void,
    onChange: InputProps['onChange'],
};
