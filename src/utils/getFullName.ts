import { isContact, isOwner } from "../utils";
import type { Contact, Owner } from "../services/hubspot/types";

type User =
  | Pick<Contact["properties"], "firstname"|"lastname"|"email">
  | Pick<Owner, "firstName"|"lastName"|"email">;

const getFullName = (user?: User): string|undefined => {
    if (!user) {
        return
    }

    const fullName: string[] = [];

    if (isContact(user)) {
        if (user.firstname) {
          fullName.push(user.firstname);
        }
        if (user.lastname) {
          fullName.push(user.lastname);
        }
    } else if (isOwner(user)) {
        if (user.firstName) {
          fullName.push(user.firstName);
        }
        if (user.lastName) {
          fullName.push(user.lastName);
        }
    }

    return (fullName.length > 0) ? fullName.join(" ") : user.email;
};

export { getFullName };
