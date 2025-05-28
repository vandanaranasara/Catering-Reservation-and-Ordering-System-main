
const firebaseConfig = {
    apiKey: "AIzaSyBPcXt8H2N6hlu4ru0bPuzO9bVedeWxPWg",
    authDomain: "unified-mentor-order-system.firebaseapp.com",
    projectId: "unified-mentor-order-system",
    storageBucket: "unified-mentor-order-system.appspot.com",
    messagingSenderId: "513529029019",
    appId: "1:513529029019:web:adf84baad4aef0ad14013e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
