import { IDeskproClient } from '@deskpro/app-sdk';
import { HUBSPOT_COMPANY_ENTITY } from './constants';
import { DeskproOrganisation } from '../../types';

export function getEntityCompanyList(
    client: IDeskproClient,
    organisationID: DeskproOrganisation['id']
) {
    return client.getEntityAssociation(HUBSPOT_COMPANY_ENTITY, organisationID).list();
};