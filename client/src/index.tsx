/**
 * Application "entry point" component.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactGA from 'react-ga';
import { App } from './components/app/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import './index.css';

import registerServiceWorker from './registerServiceWorker';

const gaTrackingId: string = process.env.REACT_APP_GA_TRACKING_ID as string;
ReactGA.initialize(gaTrackingId);
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
