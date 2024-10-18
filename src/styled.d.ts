// styled.d.ts
import "styled-components";
import type { DeskproTheme } from "@deskpro/deskpro-ui";

declare module 'styled-components' {
  export interface DefaultTheme extends DeskproTheme {}
}
