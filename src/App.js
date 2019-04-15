import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import { DataList } from '@deskpro/apps-components';
import { Panel } from '@deskpro/apps-components';

/*
  This is your main App component. By default, this is the upper-most component
  for your app. You can start developing your app here like you would with
  any React app.

  The example below demonstrates using dpapp to fetch the details for the
  currently logged-in agent to show a "Hello" message.
*/

class App extends React.Component {
  static propTypes = {
    dpapp: PropTypes.object.isRequired,
    uiProps: PropTypes.shape({
      state: PropTypes.oneOf(['ready', 'loading', 'error', 'inactive']),
      display: PropTypes.oneOf(['collapsed', 'expanded', 'fullscreen']),
      badgeCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      badgeVisibility: PropTypes.oneOf(['hidden', 'visible']),
    }).isRequired,
  };

  state = {
    data: null,
  };

  componentDidMount() {
    let w = window.w = window;

    const dpapp = this.props.dpapp;
    const ticketContext = dpapp.context.get('ticket');

    ticketContext.get('person').then(person => {

      const primaryEmail = person.emails[0];

      fetch_contact_by_email(primaryEmail).then((json) => {

        console.debug("fetch_contact_by_email json:", json);
        w.json = json;

        function getter(obj){
          function get(key, alternative="") {
            if (obj[key]) {
              if (obj[key].value !== undefined) {
                return obj[key].value;
              } else {
                console.warn(
                  `property ${key} exists but not ${key}.value - ` +
                  `defaulting to "${alternative}"`
                );
              }
            }
            return alternative;
          }
          return get;
        };
        const get = getter(json.properties)
        const company = json["associated-company"];        
        const getc = getter(company.properties)
        const data = {
          company: getc("name", ""),
          companylist: [
            {
              label: "Domain name",
              value: getc("domain"),
            },
            {
              label: "Industry",
              value: getc("industry"),
            },
            {
              label: "Annual Revenue",
              value: getc("annualrevenue"),
            },
          ],
          name: `${get("firstname", "")} ${get("lastname", "").toUpperCase()}`,
          namelist: [
            {
              label: "Email",
              value: get("email"),
            },
            {
              label: "Phone",
              value: get("phone"),
            },
            {
              label: "Job Title",
              value: get("jobtitle"),
            },
            {
              label: "Lifecycle stage",
              value: get("lifecyclestage"),
            },
          ]
        };
        this.setState({data});
      });
    });
  }

  render() {
    return (
      <div>
        <Panel title={access(this, "state.data.name", "Loading...")}>
          <DataList data={access(this, "state.data.namelist", [])} />
        </Panel>
        <Panel title={access(this, "state.data.company", "Loading...")}>
          <DataList data={access(this, "state.data.companylist", [])} />
        </Panel>
      </div>
    );
  }
}

function access(object, dotted_name, alternative) {
  let name_list;
  if(!dotted_name) {
    name_list = [];
  } else {
    name_list = dotted_name.split(".");
  }
  let value = object;
  for (let key of name_list) {
    if (value) {
      value = value[key];
    } else {
      return alternative;
    }
  }
  if (!value) {
    return alternative;
  }
  return value;
}
function test_access() { // eslint-disable-line no-unused-vars
  let o = {a:{b:{c:"ok"}}};
  console.assert(access(o, "a.b.c", "nope") === "ok");
  console.assert(access(o, "a.b.d", "nope") === "nope");
  console.assert(access(o, "a.a", "nope") === "nope");
  console.assert(access(o, "d", "nope") === "nope");
  console.assert(access(o.a.b, "c", "nope") === "ok");
  console.assert(access("ok", "", "nope") === "ok");
}

function fetch_contact_by_email(
  email,
  hapikey="c35b9d4e-0049-49fe-a8cf-22dc422e7512"
) {
  var options = { method: 'GET',
    mode: 'cors',
    url: 
    `https://cors-anywhere.herokuapp.com/` +
    `api.hubapi.com:443/` +
    `contacts/v1/contact/email/${email}/profile?hapikey=${hapikey}`,
    headers: { 'Content-Type': 'application/json' }
  };

  return fetch(options.url, options).then(r => r.json());
}

export default App;
