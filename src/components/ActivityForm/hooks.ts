import { useState } from "react";
import capitalize from "lodash/capitalize";
import { getOption } from "../../utils";
import type { Option } from "../../types";

const useActivityTypeOptions = () => {
    const [activityTypeOptions] = useState<Array<Option<string>>>(
        ["call", "email"].map((type) => getOption<string>(type, capitalize(type)))
    );

    return { activityTypeOptions };
};

export { useActivityTypeOptions };
