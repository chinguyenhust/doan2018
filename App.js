import React, { Component } from 'react';

import Map from './src/component/home/Map';
import DatePicker from './src/component/home/DatePicker';

import MyGroup from './src/component/group/MyGroup';
import CreatGroup from './src/component/group/CreatGroup';
import DetailGroup from './src/component/group/DetailGroup';
import CreatEvent from './src/component/group/CreatEvent';
import CreatSurvey from './src/component/group/CreatSurvey';
import DetailEvent from './src/component/group/DetailEvent';
import DetailSurvey from './src/component/group/DetailSurvey';
import InfoGroup from './src/component/group/InfoGroup';
import Chat from './src/component/group/Chat';
import UserInfo from "./src/component/group/UserInfo";
import EditUser from './src/component/group/EditUser';

import Main from './src/component/login/Main';
import Loading from './src/component/login/Loading'
import Login from './src/component/login/Login'
import SignUp from './src/component/login/SignUp';

import SearchScreen from './src/component/search/SearchScreen';
import ItemInfo from './src/component/search/ItemInfo';
import Notification from "./src/component/group/Notification";
import Direction from "./src/component/search/Direction";

import FCM from 'react-native-fcm';

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
    Chat: {
      screen: Chat,
    },
    UserInfo: {
      screen: UserInfo
    },
    EditUser: {
      screen: EditUser,
    },
    DatePicker: {
      screen: DatePicker,
    },
    SearchScreen: {
      screen: SearchScreen,    
    },
    ItemInfo: {
      screen: ItemInfo,
    },
    Notification: {
      screen: Notification,
    },
    Direction: {
      screen: Direction
    }
  }, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

let Navigation = createAppContainer(MainStack)
class AppComponent extends Component {
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
    FCM.subscribeToTopic("/topics/list")
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  ////////////////////// Add these methods //////////////////////

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
 render(){
   return(
     <Navigation/>
   )
 }
}
export default AppComponent;