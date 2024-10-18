import { P5 } from "@deskpro/deskpro-ui";
import styled from "styled-components";
import { dpNormalize } from "./styles";
import { addBlankTargetToLinks } from "../../../utils";
import type { FC } from "react";

type Props = {
  text?: string,
};

const Text = styled(P5)`
  width: 100%;

  ${dpNormalize}
`;

const DPNormalize: FC<Props> = ({ text }) => (
  <Text dangerouslySetInnerHTML={{ __html: addBlankTargetToLinks(text) || "-" }} />
);

export { DPNormalize };
