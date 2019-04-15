import React from 'react';
import PropTypes from 'prop-types';
// import { Phrase } from '@deskpro/apps-components';
import './styles.css';

import { Button } from '@deskpro/apps-components';

import { DataList } from '@deskpro/apps-components';
import { Panel } from '@deskpro/apps-components';

// var request = require("request");
// import request from 'request';

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
    me: null,
  };

  componentDidMount() {
    // dpapp is injected into your App automatically.
    // It is the main interface between your app and Deskpro itself.
    const dpapp = this.props.dpapp;

    // Here you see we're accessing the context,
    // in this case we're getting ahold of the ticket context.
    const ticketContext = dpapp.context.get('ticket');

    // And from that, we can interact with the ticket in various
    // ways. In this case we're just loading up some info about the user
    ticketContext.get('person').then(person => {
      console.debug({ person });
      const primaryEmail = person.emails[0];

      this.setState({data: null});

      find_by_email(primaryEmail).then((x) => {
        const data = {
          company: x.properties.company.value,
          list: [
            {
              label: "Email",
              value: x.properties.email.value,
            },
            {
              label: "Phone",
              value: x.properties.phone.value, // TODO .phone can be undefined
            },
            {
              label: "Job Title",
              value: x.properties.jobtitle.value, // TODO actually, I believe all of them can
            },
            {
              label: "Owner",
              value: "London"
            },
            {
              label: "Lifecycle stage",
              value: x.properties.lifecyclestage.value,
            },
          ]
        };
        console.debug({
          x,
          company: x.properties.company.value,
          email: x.properties.email.value,
          phone: x.properties.phone.value,
          jobtitle: x.properties.jobtitle.value,
          // owner: x.properties.owner. ...
          lifecyclestage: x.properties.lifecyclestage.value,
        });
        this.setState({data});
      });
    });
  }

  render() {
    return (
      <Panel title={this.state.data ? this.state.data.company : "Loading..."}>
        <DataList data={this.state.data ? this.state.data.list : []} />
      </Panel>
    );
  }
}

function find_by_email(email, hapikey="c35b9d4e-0049-49fe-a8cf-22dc422e7512") {
  console.debug(`Finding by email [${email}]`);
  var options = { method: 'GET',
    mode: 'cors',
    url: `https://cors-anywhere.herokuapp.com/api.hubapi.com:443/contacts/v1/contact/email/${email}/profile?hapikey=${hapikey}`,
    headers: { 'Content-Type': 'application/json' }
  };

  return fetch(options.url, options).then(r => r.json());
}

export default App;
