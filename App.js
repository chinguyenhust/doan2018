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
import Chat from './src/component/group/Chat';

import Main from './src/component/login/Main';
import Loading from './src/component/login/Loading'
import Login from './src/component/login/Login'
import SignUp from './src/component/login/SignUp'

import { StackNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
const MainStack = createStackNavigator(
  {
    Loading: {
      screen: Loading
    },
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
    Login: {
      screen: Login
    },
    SignUp: {
      screen: SignUp
    },
    Main: {
      screen: Main
    },
    Chat:{
      screen: Chat,
    },
  }, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default createAppContainer(MainStack)