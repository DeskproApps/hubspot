import { Link as RouterLink } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { useDeskproAppTheme } from "@deskpro/app-sdk";

const Link = ({ style, ...props }: LinkProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <RouterLink
            style={{
                color: theme.colors.cyan100,
                textDecoration: "none",
                ...style,
            }}
            {...props}
        />
    );
};

export { Link };
