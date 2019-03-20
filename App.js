import React, { Component } from 'react';

import Map from './src/component/home/Map';
import MyGroup from './src/component/group/MyGroup';
import CreatGroup from './src/component/group/CreatGroup';
import DetailGroup from './src/component/group/DetailGroup';
import CreatEvent from './src/component/group/CreatEvent';
import CreatSurvey from './src/component/group/CreatSurvey';
import DetailEvent from './src/component/group/DetailEvent';
import DetailSurvey from './src/component/group/DetailSurvey';
import InfoGroup from './src/component/group/InfoGroup';

import { StackNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
const MainStack = createStackNavigator(
  {
    MyGroup: {
      screen: MyGroup,
    },
    Map: {
      screen: Map,
    },
    CreatGroup: {
      screen: CreatGroup,
    },
    DetailGroup: {
      screen: DetailGroup,
    },
    CreatEvent: {
      screen: CreatEvent,
    },
    CreatSurvey: {
      screen: CreatSurvey,
    },
    DetailEvent: {
      screen: DetailEvent,
    },
    DetailSurvey: {
      screen: DetailSurvey,
    },
    InfoGroup: {
      screen: InfoGroup,
    },
  }, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default createAppContainer(MainStack)