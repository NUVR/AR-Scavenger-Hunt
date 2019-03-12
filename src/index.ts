import RootScene from './AppBuilder';
import * as firebase from 'firebase/app';

new RootScene();

// Only build firebase app in staging
if (process.env.NODE_ENV === 'staging') {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'ar-scavenger-hunt-51da3.firebaseapp.com',
    databaseURL: 'https://ar-scavenger-hunt-51da3.firebaseio.com',
    projectId: 'ar-scavenger-hunt-51da3',
  });
}
