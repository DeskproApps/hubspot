import { nbsp } from "../constants";

type User = {
    firstname?: string;
    lastname?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
};

const getFullName = (user?: User): string|undefined => {
    let fullName = [];

    if (user?.firstName || user?.firstname) {
        fullName.push(user?.firstName || user?.firstname);
    }

    if (user?.lastName || user?.lastname) {
        fullName.push(user?.lastName || user?.lastname)
    }

    fullName = fullName.filter(Boolean);

    return (fullName.length > 0) ? fullName.join(" ") : user?.email;
};

export { getFullName };
