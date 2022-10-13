import { FC } from "react";
import random from "lodash/random";
import { Email } from "./Email";
import { Call } from "./Call";

const Activity: FC<{ activity: any }> = ({ activity }) => {
    console.log(">>> activity:", activity);
    return  random(0, 1, true)
        ? (<Email {...activity} />)
        : (<Call {...activity} />);
};

export { Activity };
