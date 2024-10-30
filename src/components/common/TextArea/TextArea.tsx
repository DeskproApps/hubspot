import { forwardRef, Ref } from "react";
import styled from "styled-components";
import {
    TextArea as TextAreaUI,
    TextAreaWithDisplayProps,
} from "@deskpro/deskpro-ui";

type Props = TextAreaWithDisplayProps & {
    // This is needed to show the possible options 6, 10px, auto
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    minHeight?: "auto"|number|string,
};

const TextArea = styled(forwardRef(({ minHeight, ...props }: Props, ref: Ref<HTMLTextAreaElement>) =>
    <TextAreaUI
        variant="inline"
        placeholder="Enter value"
        {...props} ref={ref}
    />
)) <Props>`
    min-height: ${({ minHeight = 100 }) => (typeof minHeight === "number") ? `${minHeight}px` : minHeight};
    align-items: flex-start;
  `;

export { TextArea };
