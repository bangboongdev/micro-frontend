import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

var firebaseConfig = {
  apiKey: "AIzaSyCxU5bRXq32RLeQAqO_YJL8fUTyOCNbJaA",
  authDomain: "onelog-e-logistics.firebaseapp.com",
  databaseURL: "https://onelog-e-logistics.firebaseio.com",
  projectId: "onelog-e-logistics",
  storageBucket: "onelog-e-logistics.appspot.com",
  messagingSenderId: "893209813946",
  appId: "1:893209813946:web:a01a2b709c49d836097383",
  measurementId: "G-JFBCBDN9BF"
}

firebase.initializeApp(firebaseConfig)

export default firebase.messaging()