
const firebaseConfig = {
    apiKey: "",
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
          const orderItem = document.createElement('tr');
          orderItem.innerHTML = `
            <td>${doc.id}</td>
            <td>${order.customerName}</td>
            <td>${order.customerPhone}</td>
            <td>${order.productId}</td>
            <td>${order.quantity}</td>
            <td>₹${order.totalAmount}</td>
          `;
          orderList.appendChild(orderItem);
        });
      })
      .catch((error) => {
        console.error('Error getting orders: ', error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', displayOrders);
  
