import { P5, Tag as TagUI, lightTheme, Stack } from "@deskpro/deskpro-ui";
import type { FC } from "react";

const Tag: FC<{ tag: string }> = ({ tag }) => (
  <TagUI
    color={{
      borderColor: lightTheme.colors.grey80,
      backgroundColor: `${lightTheme.colors.grey80}33`,
      textColor: lightTheme.colors.grey80,
    }}
    label={tag}
    withClose={false}
  />
);

const Tags: FC<{ tags: string[] }> = ({ tags }) => {
  if (!Array.isArray(tags) || (tags.length === 0)) {
    return <P5>-</P5>;
  }

  return (
    <Stack gap={6} wrap="wrap">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag}/>
      ))}
    </Stack>
  );
};

export { Tag, Tags };
