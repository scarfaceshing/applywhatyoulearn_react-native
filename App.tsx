import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ScattererPage from './Pages/ScattererPage';
import HomePage from './Pages/HomePage';
import DatabasePage from './Pages/DatabasePage';
import TestPage from './Pages/TestPage';
import {Provider} from 'react-redux';
import store from './store/store';
import ReduxPage from './Pages/ReduxPage';
import FloatingBubblePage from './Pages/FloatingBubblePage';

interface State {}

interface Props {}

const Drawer = createDrawerNavigator();

class App extends React.Component<Props, State> {
  render() {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Drawer.Navigator initialRouteName={'Home'}>
              <Drawer.Screen name="Scatterer" component={ScattererPage} />
              <Drawer.Screen name="Database" component={DatabasePage} />
              <Drawer.Screen name="Home" component={HomePage} />
              <Drawer.Screen name="Redux" component={ReduxPage} />
              <Drawer.Screen name="Floating" component={FloatingBubblePage} />
              <Drawer.Screen name="Test" component={TestPage} />
            </Drawer.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    );
  }
}

export default App;
