import { Input } from "../../common";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const TextField: FC<FieldProps<string>> = ({ formControl }) => {
  return (
    <Input id={formControl.field.name} {...formControl.field} />
  );
};

export { TextField };
