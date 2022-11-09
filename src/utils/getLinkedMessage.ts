const getLinkedMessage = (userId: string, fullName: string, link?: string): string => {
    return `Linked to Deskpro user ${userId} ${fullName} ${!link ? "" : link}`;
};

const getUnlinkedMessage = (userId: string, fullName: string, link?: string): string => {
    return `Unlinked from Deskpro user ${userId} ${fullName} ${!link ? "" : link}`;
};

export { getLinkedMessage, getUnlinkedMessage };
