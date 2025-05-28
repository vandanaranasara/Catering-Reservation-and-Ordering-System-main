
const firebaseConfig = {
    apiKey: "AIzaSyBPcXt8H2N6hlu4ru0bPuzO9bVedeWxPWg",
    authDomain: "unified-mentor-order-system.firebaseapp.com",
    projectId: "unified-mentor-order-system",
    storageBucket: "unified-mentor-order-system.appspot.com",
    messagingSenderId: "513529029019",
    appId: "1:513529029019:web:adf84baad4aef0ad14013e"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
    
        const user = userCredential.user;
        console.log('User logged in:', user.uid);
       
        window.location.href = 'dashboard.html'; 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorMessage);
        
        alert(errorMessage); 
      });
  });
  