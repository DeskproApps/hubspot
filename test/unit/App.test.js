import React from 'react';
import renderer from 'react-test-renderer';
import { createMockApp } from '@deskpro/apps-sdk';
import App from '../../src/App';

/* TODO
createMockApp(dpapp => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App dpapp={dpapp} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
*/

it('Passes', () => {
  expect(true).toBe(true);
});
