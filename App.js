import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/welcomeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AppTabNavigator } from './components/AppTabNavigator';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';
import { appStackNavigator } from './components/AppStackNavigator'

export default class App extends React.Component {
  render () {
    return (
      <AppContainer/>
    );
  }
}

const SwitchNavigator = createSwitchNavigator ({
  WelcomeScreen : { screen : WelcomeScreen },
  Drawer : { screen : AppDrawerNavigator },
  Stack : { screen : appStackNavigator }
});

const AppContainer = createAppContainer (SwitchNavigator);