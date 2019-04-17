const fetcher = {
  hapikey: "c35b9d4e-0049-49fe-a8cf-22dc422e7512",
};

function cors_fetch(base_url, query_string_param, option) {
  base_url = new URL(base_url);
  if (base_url.protocol !== "https:") {
    throw new Error(
      `cors_fetch expects https only - not "${base_url.protocol}"`
    );
  }

  const url = new URL(
    `https://cors-anywhere.herokuapp.com/` +
    `${base_url.hostname}:443${base_url.pathname}${base_url.search}`
  );
  Object.keys(query_string_param).forEach(key => {
    url.searchParams.append(key, query_string_param[key]);
  });

  option = {
    ...option,
    method: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
  }

  return fetch(url, option);
}

function fetch_contact_by_email(email, hapikey = fetcher.hapikey) {
  const url =
    `https://api.hubapi.com` +
    `/contacts/v1/contact/email/${email}/profile`;
  return cors_fetch(url, { hapikey }).then(r => r.json());
}

// /**
//  * Use a deprecated API request because it's the only way to batch
//  * obtain the needed information.
//  * @param {*} contactId contact vid
//  * @param {*} hapikey
//  */
// function fetch_deals_by_contact(contactId, hapikey = fetcher.hapikey) {
//   // https://developers.hubspot.com/docs/methods/crm-associations/crm-associations-overview
//   const contact_to_deal_defintion_id = 4;

//   const url =
//     `https://api.hubapi.com` +
//     `/deals/v1/deal/associated/contact/${contactId}/paged`;
//   return cors_fetch(url, { hapikey }).then(r => r.json());
// }


/**
 * Use the Hubspot Associations API to get the deal ids associated with
 * a contact
 * @param {*} contactId contact vid
 * @param {*} hapikey
 */
function fetch_dealId_by_contact(contactId, hapikey = fetcher.hapikey) {
  // https://developers.hubspot.com/docs/methods/crm-associations/crm-associations-overview
  const contact_to_deal_defintion_id = 4;

  const url =
    `https://api.hubapi.com` +
    `/crm-associations/v1/associations/${contactId}/HUBSPOT_DEFINED/` +
    `${contact_to_deal_defintion_id}`;
  return cors_fetch(url, { hapikey }).then(r => r.json());
}

/* TODO refactor copy-pasted code */
function fetch_engagementId_by_contact(contactId, hapikey = fetcher.hapikey) {
  // https://developers.hubspot.com/docs/methods/crm-associations/crm-associations-overview
  const contact_to_engagement_defintion_id = 9;

  const url =
    `https://api.hubapi.com` +
    `/crm-associations/v1/associations/${contactId}/HUBSPOT_DEFINED/` +
    `${contact_to_engagement_defintion_id}`;
  return cors_fetch(url, { hapikey }).then(r => r.json());
}

function fetch_deal(dealId, hapikey = fetcher.hapikey) {
  const url =
    `https://api.hubapi.com` +
    `/deals/v1/deal/${dealId}`;
  return cors_fetch(url, { hapikey }).then(r => r.json());
}

/* TODO refactor copy-pasted code */
function fetch_engagement(engagementId, hapikey = fetcher.hapikey) {
  const url =
    `https://api.hubapi.com` +
    `/engagements/v1/engagements/${engagementId}`;
  return cors_fetch(url, { hapikey }).then(r => r.json());
}

export {
  fetch_contact_by_email,
  fetch_dealId_by_contact,
  fetch_engagementId_by_contact,
  fetch_deal,
  fetch_engagement,
};
