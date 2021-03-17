import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyBZ4AZuZarRIvif41WyL8gQN4iQsjPe2u0",
    authDomain: "booksanta-50f0f.firebaseapp.com",
    projectId: "booksanta-50f0f",
    storageBucket: "booksanta-50f0f.appspot.com",
    messagingSenderId: "442737073412",
    appId: "1:442737073412:web:f3cac864bc3b1541868451"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();