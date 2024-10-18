import { forwardRef } from "react";
import { Input as InputUI } from "@deskpro/deskpro-ui";
import type { FC, Ref } from "react";
import { InputProps } from "@deskpro/deskpro-ui";

const Input: FC<InputProps> = forwardRef((props, ref: Ref<HTMLInputElement>) => (
  <InputUI
    ref={ref}
    type="text"
    variant="inline"
    inputsize="small"
    placeholder="Add value"
    {...props}
  />
));

export { Input };
