import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import {
  Fetcher
} from './Fetcher';

import {
  access,
  obtain,
} from './util';

import {
  SwitchCase,
} from './Component';

import {
  CreateDealForm,
  PersonDataList,
  CompanyDataList,
  DealList,
  NoteList,
  ActivityList,
} from './UI';

import {
  Panel,
  Tabs,
  TabMenu,
} from '@deskpro/apps-components';

/**
 * return a function which gets the `.value` property of the specified property,
 * and handles missing property cases.
 */
function value_getter(obj) {
  return function get(key, alternative = "") {
    if (obj[key]) {
      if (obj[key].value !== void 0) {
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

const fetcher = new Fetcher({
  qs: { hapikey: "c35b9d4e-0049-49fe-a8cf-22dc422e7512" },
  fetch_f: fetch,
});

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
    activeTab: "deals",
    screen: ["default_screen", "create_deal_screen"][0],
  }

  componentDidMount() {

    console.clear();
    const me = this;
    console.debug(function state(o = {}) { return o.s = me.state; })

    const dpapp = this.props.dpapp;
    const ticket_context = dpapp.context.get('ticket');

    this.setState({ ticket_context }, () => this.fetch_data());

  }

  fetch_data() {
    this.state.screen.match(/default/) && // Temporary
      this.state.ticket_context.get('person').then(person => {

        const primaryEmail = person.emails[0];

        fetcher.contact_by_email({ id: primaryEmail }).then((contact_json) => {

          this.setState({ contact_json });

          [
            [fetcher.dealId_by_contact, fetcher.deal,
              "dealId_a", "deal_a"],
            [fetcher.engagementId_by_contact, fetcher.engagement,
              "engagementId_a", "engagement_a"],
          ].forEach((
            [fetch_its_id_by_contact, fetch_it,
              id_array_n, array_n]) => {
            fetch_its_id_by_contact({ id: contact_json.vid }).then((json) => {

              const array = this.state[array_n] || [];
              this.setState({
                [id_array_n]: json.results,
                [array_n]: new Array(json.results.length).fill().map(
                  (_, index) => array[index] || null,
                ),
              });

              json.results.forEach((id, index) => {
                return fetch_it({ id }).then((deal_json) => {
                  let array = this.state[array_n];
                  array[index] = deal_json;
                  this.setState({ [array_n]: array });
                });
              });
            });
          });
        });
      });
  }

  render_parse_state() {
    let get_n, get_c;
    if (this.state.contact_json !== void 0) {
      get_n = value_getter(this.state.contact_json.properties);
      get_c = value_getter(this.state.contact_json["associated-company"].properties);
    }
    else {
      get_n = get_c = (a, b) => b;
    }

    const both = get_n("firstname") && get_n("lastname");
    const name = get_n("firstname", "") +
      (both ? " " : "") +
      get_n("lastname", "").toUpperCase();

    const company = get_c("name", "");
    const deal_index_a = access(this.state, "dealId_a", [])
      .map((_dealId, index) => index)
      .filter((index) => this.state.deal_a[index] !== null);

    let note_json_a = [];
    let activity_json_a = [];
    let show_engagement_count = false;

    /* Sort existing engagment json into note_json and activity_json */
    obtain(this.state, "engagementId_a", (engagementId_a) => {
      const engagement_json_a = engagementId_a
        .map((_engagmentId, index) => index)
        .filter((index) => this.state.engagement_a[index] !== null)
        .map((index) => this.state.engagement_a[index]);

      engagement_json_a.forEach((json) => {
        if (json.engagement.type === "NOTE") {
          note_json_a.push(json);
        }
        else {
          activity_json_a.push(json);
        }
      });

      if (engagement_json_a.length === engagementId_a.length) {
        show_engagement_count = true;
      }
    }, () => {});

    return {
      deal_index_a, activity_json_a, note_json_a,
      name, get_n,
      company, get_c,
      show_engagement_count,
    };
  }

  render() {
    console.debug("render", {state: this.state});

    let {
      deal_index_a, activity_json_a, note_json_a,
      name, get_n,
      company, get_c,
      show_engagement_count,
    } = this.render_parse_state();

    const create_deal_callback_f = () => {
      this.setState({screen: "create_deal_screen"});
    };

    const renderDealList =
      (props) => <DealList {...props} {...{
        create_deal_callback_f,
        deal_index_a,
        deal_a: this.state.deal_a || [],
        value_getter,
      }} />;

    const renderActivityList =
      (props) => <ActivityList {...props} {...{ activity_json_a }} />;

    const renderNoteList =
      (props) => <NoteList {...props} {...{ note_json_a }} />;

    const renderDefaultScreen = () => <div>
      <Panel title={name}>
        <PersonDataList getter={get_n} />
      </Panel>
      <Panel title={company}>
        <CompanyDataList getter={get_c} />
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
      <SwitchCase
        on={this.state.activeTab}
        render_o={{
          deals: renderDealList,
          activities: renderActivityList,
          notes: renderNoteList,
        }}
      ></SwitchCase>
    </div>

    const goto_default_screen = () =>
      this.setState({ screen: "default_screen" });

    const renderCreateDealScreen = () =>
    <CreateDealForm
      cancel_f={goto_default_screen}
      finish_f={() => {
        goto_default_screen();
        this.fetch_data();
      }}
    ></CreateDealForm>;

    return <SwitchCase
      on={this.state.screen}
      render_o={{
        default_screen: renderDefaultScreen,
        create_deal_screen: renderCreateDealScreen,
      }}
    ></SwitchCase>
  }
}


  export default App;
