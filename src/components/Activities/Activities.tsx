import { FC } from "react";
import random from "lodash/random";
import { Email } from "./Email";
import { Call } from "./Call";

const Activities: FC<{ activity: any }> = () => {
    return  random(0, 1, true)
        ? (<Email/>)
        : (<Call/>);
};

export { Activities };
