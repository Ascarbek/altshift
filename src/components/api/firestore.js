
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/storage';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
// import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsxRIwSaMHTk8aKrf2QcDeGc7X6cD-QJE",
  authDomain: "alt-shift.firebaseapp.com",
  databaseURL: "https://alt-shift.firebaseio.com",
  projectId: "alt-shift",
  storageBucket: "alt-shift.appspot.com",
  messagingSenderId: "564762592179",
  appId: "1:564762592179:web:1491248af28ffa0deb41c6"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const ref = firebase.storage().ref();

    ref.child('uYGj04Iti3E').listAll().then(res => {
      res.items.forEach(function(itemRef) {
        console.log(itemRef);
      });
    });
  }
  else {

  }
});


