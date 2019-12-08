import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import * as firebase from 'firebase';
//demo config
const firebacongseConfig = {
  // DEMO DATABASE
  apiKey: "AIzaSyDwEJaLeIDOSiNsG3KHNmxuoCPtUJuH1EM",
  authDomain: "spending-app-demo.firebaseapp.com",
  databaseURL: "https://spending-app-demo.firebaseio.com",
  projectId: "spending-app-demo",
  storageBucket: "spending-app-demo.appspot.com",
  messagingSenderId: "1012644184355",
  appId: "1:1012644184355:web:4b28be8970970669f94c96",
  measurementId: "G-P3T6MQF33M"


  };

  firebase.initializeApp(firebacongseConfig);
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
