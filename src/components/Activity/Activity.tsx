import { FC } from "react";
import { Email } from "./Email";
import { Call } from "./Call";
import type { Contact, CallActivity, EmailActivity } from "../../services/hubspot/types";

const Activity: FC<{
    activity: CallActivity["properties"] | EmailActivity["properties"],
    type: "email"|"call",
    contacts: Array<Contact["properties"]>,
    portalId?: number
}> = ({ type, activity, contacts, portalId }) => {
    return  (type === "email")
        ? (<Email {...activity} contacts={contacts} portalId={portalId} />)
        : (<Call {...activity} contacts={contacts} portalId={portalId} />);
};

export { Activity };