import ReactDOM from 'react-dom';
import React from 'react';
import { createApp } from '@deskpro/apps-sdk';
import { DefaultDeskproApp } from '@deskpro/apps-components';

import App from './App';
import * as phrasePacks from './locales/**/*.{json,yaml,yml}';

/*
  This is the main entry point for the browser. It's pre-configured
  to boot the Deskpro Apps system and render your App. You usually
  don't need to modify this unless you want to add some special
  bootup behaviour.

  If you don't need anything special, leave this alone and continue on to
  your main App.js component.
 */

createApp(dpapp => props => {
  ReactDOM.render(
    <DefaultDeskproApp dpapp={dpapp} phrasePacks={phrasePacks} {...props}>
      <App
        dpapp={dpapp}
        uiProps={{
          state: props.state,
          display: props.display,
          badgeCount: props.badgeCount,
          badgeVisibility: props.badgeVisibility,
        }}
      />
    </DefaultDeskproApp>,
    document.getElementById('root')
  );
});
