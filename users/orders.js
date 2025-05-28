
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
  
  const orderList = document.getElementById('orderList');
  
  function displayOrders() {
    db.collection('orders').orderBy('timestamp', 'desc').get() 
      .then((querySnapshot) => {
        orderList.innerHTML = '';
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          const orderItem = document.createElement('div');
          orderItem.classList.add('order-item');
          orderItem.innerHTML = `
            <h3>Order ID: ${doc.id}</h3>
            <p>Product Name: ${order.productName}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Total Amount: ₹${order.totalAmount}</p>
            <p>Customer Name: ${order.customerName}</p>
            <p>Customer Phone: ${order.customerPhone}</p>
            <hr>
          `;
          orderList.appendChild(orderItem);
        });
      })
      .catch((error) => {
        console.error('Error getting orders: ', error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', displayOrders);
  