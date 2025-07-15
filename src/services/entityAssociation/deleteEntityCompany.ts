import { IDeskproClient } from '@deskpro/app-sdk';
import { HUBSPOT_COMPANY_ENTITY } from './constants';
import { DeskproOrganisation } from '../../types';
import { Company } from '../hubspot/types';

export function deleteEntityCompany(
    client: IDeskproClient,
    organisationID: DeskproOrganisation['id'],
    companyID: Company['id']
) {
    return client.getEntityAssociation(HUBSPOT_COMPANY_ENTITY, organisationID).delete(companyID);
};