import type { EventPayload, UnlinkCompanyPayload } from '../types';

export function isUnlinkCompanyPayload(payload: EventPayload): payload is UnlinkCompanyPayload {
    return payload?.type === 'unlink-company'
        && typeof payload === 'object'
        && payload !== null
        && 'companyID' in payload;
};