import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import {
  fetch_contact_by_email,
  fetch_dealId_by_contact,
  fetch_deal,
} from './fetcher.js';
import { access, wtf } from './util.js';

import { DataList } from '@deskpro/apps-components';
import { Panel } from '@deskpro/apps-components';
import { Tabs } from '@deskpro/apps-components';
import { TabMenu } from '@deskpro/apps-components';
import { List } from '@deskpro/apps-components';

import * as d3 from 'd3-format';

/*
  This is your main App component. By default, this is the upper-most component
  for your app. You can start developing your app here like you would with
  any React app.

  The example below demonstrates using dpapp to fetch the details for the
  currently logged-in agent to show a "Hello" message.
*/

/**
 * return a function which gets the `.value` property of the specified property,
 * and handles missing property cases.
 */
function value_getter(obj) {
  return function get(key, alternative = "") {
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
  };
};


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
    activeTab: "deals"
  };

  componentDidMount() {
    const dpapp = this.props.dpapp;
    const ticketContext = dpapp.context.get('ticket');

    ticketContext.get('person').then(person => {

      const primaryEmail = person.emails[0];

      fetch_contact_by_email(primaryEmail).then((json) => {
        // console.debug("fetch_contact_by_email json:", json);

        this.setState({ json });

        return fetch_dealId_by_contact(json.vid);
      }).then((json) => {
        console.debug("fetch_deals_by_contact json:", json);

        this.setState({ deal_a: json.results });

        json.results.map((dealId, index) => {
          return fetch_deal(dealId).then((deal_json) => {
            console.debug({deal_json, index});
            this.setState({ [`deal_json[${index}]`]: deal_json });
          });
        });
      });
    });
    console.log("state", (o) => o.s = this.state)
  }

  render() {
    window.state = this.state;
    let getn, getc;
    if (this.state.json !== undefined) {
      getn = value_getter(this.state.json.properties);
      getc = value_getter(this.state.json["associated-company"].properties);
    } else {
      getn = getc = (a, b) => b;
    }

    const both = getn("firstname") && getn("lastname");
    const name =
      getn("firstname", "") +
      (both ? " " : "") +
      getn("lastname", "").toUpperCase();

    const company = getc("name", "");
    const format_count = (arr) => arr ? ` (${arr.length})` : "";
    return (
      <div>
        <Panel title={name}>
          <DataList data={[
              ["Email", getn("email")],
              ["Phone", getn("phone")],
              ["Job Title", getn("jobtitle")],
              ["Lifecycle stage", getn("lifecyclestage")],
            ].map(([label, value]) => ({ label, value }))
          } />
        </Panel>
        <Panel title={company}>
          <DataList data={[
              ["Domain name", getc("domain")],
              ["Industry", getc("industry")],
              ["Annual Revenue",
                getc("annualrevenue") ?
                d3.format(".3s")(getc("annualrevenue")) :
                ""
              ],
            ].map(([label, value]) => ({ label, value }))
          } />
        </Panel>
        <Tabs
          active={this.state.activeTab}
          onChange={(clickedTab) => { this.setState({ activeTab: clickedTab }) }}
        >
          <TabMenu name="deals">{"Deals" + format_count(this.state.deal_a)}</TabMenu>
          <TabMenu name="activities">{"Activities" + format_count(this.state.activitie_a)}</TabMenu>
          <TabMenu name="notes">{"Notes" + format_count(this.state.note_a)}</TabMenu>
        </Tabs>
        {
          {
            "deals": <Panel><List>{
              wtf(x => ({length: x.length}))(access(wtf("a")(this.state.deal_a), "", [])
              .map((_dealId, index) => index))
              .filter((index) => (`deal_json[${index}]` in this.state))
              .map((index) => {
                const getd = value_getter(
                  access(
                    this,
                    `state.deal_json[${index}].properties`,
                    {}
                  ),
                  "-getd"
                );
                return (
                  <Panel title={getd("dealname")}>
                    <DataList data={[
                        ["Pipeline", getd("pipeline")],
                        ["Stage", getd("dealstage")],
                        ["Start date", getd("lifecyclestage")],
                        ["Amount", getd("amount")],
                      ].map(([label, value]) => ({ label, value }))
                    }/>
                  </Panel>
                )
              })
            }</List></Panel>,
            "activities": <Panel>Activities!</Panel>,
            "notes": <Panel>Notes!</Panel>,
          }[this.state.activeTab]
        }
      </div>
    );
  }
}


export default App;
