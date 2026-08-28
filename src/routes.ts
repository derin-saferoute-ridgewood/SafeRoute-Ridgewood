import { createBrowserRouter } from 'react-router';
import Root from './screens/Root';
import HomepageScreen from './screens/HomepageScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ActiveTripScreen from './screens/ActiveTripScreen';
import AboutScreen from './screens/AboutScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomepageScreen },
      { path: 'welcome', Component: WelcomeScreen },
      { path: 'active-trip', Component: ActiveTripScreen },
      { path: 'about', Component: AboutScreen },
    ],
  },
]);
