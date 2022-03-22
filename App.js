/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import AppNavigationContainer from "./src/Router/AppRouter";
import { SafeAreaView } from "react-native";
import Player from './src/Components/Player';
import { Provider } from 'mobx-react';
import Store from "./src/Store";

const App: () => Node = () => {

  return (
    <SafeAreaView style={{flex:1}}>
      <Provider {...Store}>
        <AppNavigationContainer />
        <Player/>
      </Provider>
    </SafeAreaView>
  );
};

export default App;
