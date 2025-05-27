import { FC } from "react";
import { Email } from "./Email";
import { Call } from "./Call";
import type { Contact, Owner, CallActivity, EmailActivity } from "../../services/hubspot/types";

const Activity: FC<{
    activity: CallActivity["properties"] | EmailActivity["properties"],
    type: "email"|"call",
    contacts: Array<Contact["properties"]>,
    owner?: Owner,
    portalId?: number
}> = ({ type, activity, contacts, owner, portalId }) => {
    return  (type === "email")
        ? (<Email {...activity} contacts={contacts} portalId={portalId} />)
        : (<Call {...activity} contacts={contacts} owner={owner} portalId={portalId} />);
};

export { Activity };