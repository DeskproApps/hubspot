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

class Fetcher { // es-lint-disable
  constructor(qs) {
    this.qs = qs;
    Fetcher_methods.forEach(([method_name, url]) => {
      this[method_name] = (id) => {
        return this.fetch(base + url(id));
      };
    });
  }
  fetch(url) {
    return cors_fetch(url, this.qs).then(r => r.json());
  }
}

const base = "https://api.hubapi.com";
const contact_to_deal_defintion_id = 4;
const contact_to_engagement_defintion_id = 9;
const association_url = (id, definition_id) =>
  `/crm-associations/v1/associations/${id}/HUBSPOT_DEFINED/${definition_id}`;

const Fetcher_methods = [
  [
    "contact_by_email",
    (email) => `/contacts/v1/contact/email/${email}/profile`
  ],
  [
    "deal",
    (dealId) => `/deals/v1/deal/${dealId}`
  ],
  [
    "engagement",
    (engagementId) => `/engagements/v1/engagements/${engagementId}`
  ],
  [
    "dealId_by_contact",
    (contactId) => association_url(contactId, contact_to_deal_defintion_id)
  ],
  [
    "engagementId_by_contact",
    (contactId) => association_url(contactId, contact_to_engagement_defintion_id)
  ],
]


export {
  Fetcher
};
