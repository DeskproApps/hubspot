import React from 'react';
import PropTypes from 'prop-types';
import { Phrase } from '@deskpro/apps-components';
import './styles.css';

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
    const { dpapp } = this.props;
    dpapp.context.getMe().then(me => this.setState({ me }));
  }

  render() {
    const { me } = this.state;
    return (
      <p>
        {me ? (
          <Phrase id="hello_name" name={me.name} />
        ) : (
          <Phrase id="loading" />
        )}
      </p>
    );
  }
}

export default App;
