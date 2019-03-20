import * as firebase from 'firebase';
const config = {
  apiKey: "AIzaSyDPAUN3XC6_Vh80Je7K20ra-pvpH3_HAUY",
    authDomain: "doan-2b247.firebaseapp.com",
    databaseURL: "https://doan-2b247.firebaseio.com",
    projectId: "doan-2b247",
    storageBucket: "doan-2b247.appspot.com",
    messagingSenderId: "21934368463"
};
const app = firebase.initializeApp(config);
export const Data = app.database();