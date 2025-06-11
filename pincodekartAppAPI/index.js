import { registerRootComponent } from 'expo';

import App from './App';

export const images = {
    banner: require('./assets/images/banner1.jpg'), // Apne banner image ka naam yahan daal
  };

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
