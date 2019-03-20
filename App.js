import React, { Component } from 'react';

import Map from './src/component/home/Map';
import MyGroup from './src/component/group/MyGroup';

import { StackNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
const MainStack = createStackNavigator(
  {
    MyGroup: {
      screen: MyGroup,
    },
    Map: {
      screen: Map,
    },
  }, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default createAppContainer(MainStack)