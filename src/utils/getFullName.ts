import { nbsp } from "../constants";

type User = {
    firstName?: string,
    lastName?: string,
};

const getFullName = (user: User = {}): string => {
    const fullName = [];

    if (user?.firstName) {
        fullName.push(user.firstName);
    }

    if (user?.lastName) {
        fullName.push(user.lastName)
    }

    return fullName.join(nbsp);
};

export { getFullName };
