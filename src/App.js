import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import {
  HubspotFetcher
} from './HubspotFetcher';

import {
  access,
  obtain,
  LocalStorageState,
  cors_anywhere_fetch,
} from './util';

import {
  SwitchCase,
} from './component';

import {
  CreateDealForm,
  PersonDataList,
  CompanyDataList,
  DealList,
  NoteList,
  ActivityList,
  CreateNewDealLink,
} from './UI';

import {
  Panel,
  Tabs,
  TabMenu,
} from '@deskpro/apps-components';

import {
  OauthPanel
} from './oauth';

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

const fetcher = new HubspotFetcher({
  query_string: { hapikey: "c35b9d4e-0049-49fe-a8cf-22dc422e7512" },
  fetch_f: cors_anywhere_fetch({ fetch_f: fetch }),
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
    screen: ["default_screen", "create_deal_screen", "oauth_screen"][0],
  }

  componentDidMount() {

    const me = this;
    console.debug(function app(o = {}) { return o.app = me; })

    const dpapp = this.props.dpapp;
    const ticket_context = dpapp.context.get('ticket');

    this.setState({ ticket_context }, () => this.fetch_data());

  }

  async fetch_data() {
    const person = await this.state.ticket_context.get('person')

    const primaryEmail = person.emails[0];

    const contact_json = await fetcher.contact_by_email(primaryEmail);

    this.setState({ contact_json });

    if (!this.state.screen.match(/default/)) { return; }

    [
      [fetcher.dealId_by_contact, fetcher.deal,
        "dealId_a", "deal_a"],
      [fetcher.engagementId_by_contact, fetcher.engagement,
        "engagementId_a", "engagement_a"],
    ].forEach(async (
      [fetch_its_id_by_contact, fetch_it,
        id_array_n, array_n]
    ) => {
      const json = await fetch_its_id_by_contact(contact_json.vid);

      const array = this.state[array_n] || [];
      this.setState({
        [id_array_n]: json.results,
        [array_n]: new Array(json.results.length).fill().map(
          (_, index) => array[index] || null,
        ),
      });

      json.results.forEach((id, index) => {
        fetch_it(id).then((deal_json) => {
          let array = this.state[array_n];
          array[index] = deal_json;
          this.setState({ [array_n]: array });
        });
      });
    });
  }

  render_parse_state() {
    let get_n, get_c;
    let enable_create_deal;
    if (this.state.contact_json !== void 0) {
      get_n = value_getter(this.state.contact_json.properties);
      get_c = value_getter(this.state.contact_json["associated-company"].properties);
      enable_create_deal = true;
    }
    else {
      get_n = get_c = (a, b) => b;
      enable_create_deal = false;
    }

    const both = get_n("firstname") && get_n("lastname");
    const name =
      get_n("firstname", "") +
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
    }, () => { });

    return {
      deal_index_a, activity_json_a, note_json_a,
      name, get_n,
      company, get_c,
      show_engagement_count,
      enable_create_deal,
    };
  }

  render() {
    console.debug("render", { state: this.state });

    let {
      deal_index_a, activity_json_a, note_json_a,
      name, get_n,
      company, get_c,
      show_engagement_count,
      enable_create_deal,
    } = this.render_parse_state();

    const renderCreateNewDealLink =
      () => <CreateNewDealLink
        {...{ enable_create_deal }}
        callback_f={() => {
          this.setState({ screen: "create_deal_screen" });
        }}
      />;

    const renderDealList =
      () => <DealList {...{
        render_head: renderCreateNewDealLink,
        deal_index_a,
        deal_a: this.state.deal_a || [],
        value_getter,
      }} />;

    const renderActivityList =
      () => <ActivityList {...{ activity_json_a }} />;

    const renderNoteList =
      () => <NoteList {...{ note_json_a }} />;

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
      {renderOauthScreen()}
    </div>

    const goto_default_screen = () => new Promise((resolve) => {
      this.setState({ screen: "default_screen" }, resolve)
    });

    const renderCreateDealScreen = () =>
      <CreateDealForm
        {...{ name, get_n }}
        cancel_f={goto_default_screen}
        submit_f={(form, { setSubmitting }) => {
          let property_o = {};
          HubspotFetcher.create_deal.all_property_a.forEach((name) => {
            const value = form[name];
            if (value) {
              property_o[name] = { name, value };
            }
          })
          fetcher.create_deal({
            body: { properties: property_o }
          }).catch((error) => {
            console.error("fetcher.create_deal", error);
          }).then(async () => {
            setSubmitting(false);
            await goto_default_screen();
            await this.fetch_data();
          })
        }}
      ></CreateDealForm>;

    const oauth_nocsrf_a_state = LocalStorageState({
      key: "deskpro_hubspot_oauth_nocsrf_a",
      default_value: [],
      component: this,
    });
    const oauth_code_state = LocalStorageState({
      key: "deskpro_hubspot_oauth_code",
      default_value: null,
      component: this,
    });
    const renderOauthScreen = () => <OauthPanel
      {...{ oauth_nocsrf_a_state, oauth_code_state }}
    />

    return <SwitchCase
      on={this.state.screen}
      render_o={{
        default_screen: renderDefaultScreen,
        create_deal_screen: renderCreateDealScreen,
        oauth_screen: renderOauthScreen,
      }}
    ></SwitchCase>
  }
}

export default App;


