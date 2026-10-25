import { createBrowserRouter } from 'react-router';
import Root from './screens/Root';
import HomepageScreen from './screens/HomepageScreen';
import RouteConfigurationScreen from './screens/RouteConfigurationScreen';
import ActiveTrip2Screen from './screens/ActiveTrip2Screen';
import AboutScreen from './screens/AboutScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomepageScreen },
      { path: 'welcome', Component: RouteConfigurationScreen },
      { path: 'route-config', Component: RouteConfigurationScreen },
      { path: 'active-trip', Component: ActiveTrip2Screen },
      { path: 'active-trip2', Component: ActiveTrip2Screen },
      { path: 'about', Component: AboutScreen },
    ],
  },
]);
