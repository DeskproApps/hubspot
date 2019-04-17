import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import {
  fetch_contact_by_email,
  fetch_dealId_by_contact,
  fetch_engagementId_by_contact,
  fetch_deal,
  fetch_engagement,
} from './fetcher';

import {
  access,
  obtain
} from './util';

import {
  DataList,
  Panel,
  Tabs,
  TabMenu,
  List,
} from '@deskpro/apps-components';

import * as d3 from 'd3-format';

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
    console.clear();
    const dpapp = this.props.dpapp;
    const ticketContext = dpapp.context.get('ticket');

    ticketContext.get('person').then(person => {

      const primaryEmail = person.emails[0];

      fetch_contact_by_email(primaryEmail).then((json) => {
        // console.debug("fetch_contact_by_email json:", json);

        this.setState({ json });

        fetch_dealId_by_contact(json.vid).then((json) => {
          // console.debug("fetch_deals_by_contact json:", json);

          this.setState({
            dealId_a: json.results,
            deal_a: new Array(json.results.length).fill(null),
          });

          json.results.map((dealId, index) => {
            return fetch_deal(dealId).then((deal_json) => {
              // console.debug({deal_json, index});

              // let deal_a = Array.from(this.state.deal_a);
              // deal_a[index] = deal_json;
              // this.setState({ deal_a });

              let deal_a = this.state.deal_a;
              deal_a[index] = deal_json;
              // console.assert(this.state.deal_a[index] === deal_json);
              this.setState({ deal_a });

              // this.setState({ [`deal_json[${index}]`]: deal_json });
            });
          });
        });

        /* TODO refactor copy-pasted code */
        fetch_engagementId_by_contact(json.vid).then((json) => {
          console.debug("fetch_engagementId_by_contact json:", json);

          this.setState({
            engagementId_a: json.results,
            engagement_a: new Array(json.results.length).fill(null),
          });

          json.results.map((engagementId, index) => {
            return fetch_engagement(engagementId).then((engagement_json) => {
              // console.debug({ engagement_json, index });

              let engagement_a = this.state.engagement_a;
              engagement_a[index] = engagement_json;
              this.setState({ engagement_a });

              // this.setState({ [`engagement_json[${index}]`]: engagement_json });
            });
          });
        });
      })
    });
    console.debug("state", (o) => o.s = this.state)
  }

  render() {
    window.state = this.state;
    let get_n, get_c;
    if (this.state.json !== undefined) {
      get_n = value_getter(this.state.json.properties);
      get_c = value_getter(this.state.json["associated-company"].properties);
    } else {
      get_n = get_c = (a, b) => b;
    }

    const both = get_n("firstname") && get_n("lastname");
    const name =
      get_n("firstname", "") +
      (both ? " " : "") +
      get_n("lastname", "").toUpperCase();

    const company = get_c("name", "");

    const deal_index_a =
      access(this.state, "dealId_a", [])
        .map((_dealId, index) => index)
        .filter((index) => this.state.deal_a[index] !== null);

    let note_json_a = [];
    let activity_json_a = [];
    let show_engagement_count = false;

    obtain(this.state, "engagementId_a", (engagementId_a) => {
      const engagement_json_a = engagementId_a
        .map((_engagmentId, index) => index)
        .filter((index) => this.state.engagement_a[index] !== null)
        .map((index) => obtain(
          this.state,
          `engagement_a.${index}`,
          (x) => x,
          () => {
            console.error(`Unexplicably couldn't obtain engagement_json[${index}]`);
            return null;
          }
        ))

      engagement_json_a.forEach((json) => {
        if (json.engagement.type === "NOTE") {
          note_json_a.push(json);
        } else {
          activity_json_a.push(json);
        }
      });

      if (engagement_json_a.length === engagementId_a.length) {
        show_engagement_count = true;
      }

    }, () => {});

    return (
      <div>
        <Panel title={name}>
          <DataList data={[
            ["Email", get_n("email")],
            ["Phone", get_n("phone")],
            ["Job Title", get_n("jobtitle")],
            ["Lifecycle stage", get_n("lifecyclestage")],
          ].map(([label, value]) => ({ label, value }))
          } />
        </Panel>
        <Panel title={company}>
          <DataList data={[
            ["Domain name", get_c("domain")],
            ["Industry", get_c("industry")],
            ["Annual Revenue",
              get_c("annualrevenue") ?
                d3.format(".3s")(get_c("annualrevenue")) :
                ""
            ],
          ].map(([label, value]) => ({ label, value }))
          } />
        </Panel>
        <Tabs
          active={this.state.activeTab}
          onChange={(clickedTab) => {
            this.setState({ activeTab: clickedTab });
          }}
        >
          <TabMenu name="deals">{
            "Deals" + ((arr) => arr ? ` (${arr.length})` : "")(this.state.dealId_a)
          }</TabMenu>
          <TabMenu name="activities">{
            "Activities" + (show_engagement_count ? ` (${activity_json_a.length})` : "")
          }</TabMenu>
          <TabMenu name="notes">{
            "Notes" + (show_engagement_count ? ` (${note_json_a.length})` : "")
          }</TabMenu>
        </Tabs>
        {
          {
            "deals": () => <Panel><List>{
              deal_index_a.map((index) => {
                const getd = value_getter(
                  access(this.state,`deal_a.${index}.properties`, {}),
                  ""
                );
                return (
                  <Panel title={getd("dealname")} key={index}>
                    <DataList data={[
                      ["Pipeline", getd("pipeline")],
                      ["Stage", getd("dealstage")],
                      ["Start date", getd("lifecyclestage")],
                      ["Amount", getd("amount")],
                    ].map(([label, value]) => ({ label, value }))
                    } />
                  </Panel>
                )
              })
            }</List></Panel>,
            "activities": () => <Panel><List>{
              activity_json_a.map((json) =>
                <Panel
                  title={json.engagement.type}
                  key={json.engagement.id}
                >{
                    json.engagement.bodyPreview
                  }</Panel>
              )
            }</List></Panel>,
            "notes": () => <Panel><List>{
              note_json_a.map((json) =>
                <Panel
                  key={json.engagement.id}
                >{
                    json.engagement.bodyPreview
                  }</Panel>
              )
            }</List></Panel>,
          }[this.state.activeTab]()
        }
      </div>
    );
  }
}


export default App;
