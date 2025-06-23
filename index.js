/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigators from './navigations/StackNavigation'; // Update the path if necessary
import {name as appName} from './app.json';
import {UserProvider} from './components/context';

//import AppNavigators from './navigations/StackNavigation';
const App = () => (
  <UserProvider>
    <NavigationContainer>
      <AppNavigators />
    </NavigationContainer>
  </UserProvider>
);

AppRegistry.registerComponent(appName, () => App);
