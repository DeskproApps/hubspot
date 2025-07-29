import { useState } from "react";
import { capitalise, getOption } from "../../utils";
import type { Option } from "../../types";

const useActivityTypeOptions = () => {
    const [activityTypeOptions] = useState<Array<Option<string>>>(
        ["call", "email"].map((type) => getOption<string>(type, capitalise(type)))
    );

    return { activityTypeOptions };
};

export { useActivityTypeOptions };
