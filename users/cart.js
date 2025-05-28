
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
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const buyNowPopup = document.getElementById('buyNowPopup');
const buyNowForm = document.getElementById('buyNowForm');
const totalAmountField = document.getElementById('totalAmount'); 

function displayCart() {
  cartList.innerHTML = '';
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.productImage}" alt="${item.productName}">
      <h3>${item.productName}</h3>
      <p>Price: ₹${item.productPrice}</p>
      <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input"></p>
      <div class="cart-actions">
        <button data-index="${index}" class="remove-button">Remove</button>
      </div>
    `;
    cartList.appendChild(cartItem);
  });
  updateCartTotal();
  attachEventListeners();
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  cartTotal.textContent = `${total}`;
}

function attachEventListeners() {
  const quantityInputs = document.querySelectorAll('.quantity-input');
  quantityInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const index = e.target.dataset.index;
      cart[index].quantity = parseInt(e.target.value);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartTotal();
    });
  });

  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
    });
  });
}

checkoutButton.addEventListener('click', () => {
  openCheckoutPopup();
});

function openCheckoutPopup() {
  buyNowPopup.style.display = 'block';
  updateTotalAmount(); 
  buyNowForm.onsubmit = function (e) {
    e.preventDefault();
    const customerName = buyNowForm.querySelector('input[name="name"]').value;
    const customerPhone = buyNowForm.querySelector('input[name="phone"]').value;
    const totalAmount = parseFloat(cartTotal.textContent.replace('Total: ₹', '')); 

    placeOrder(customerName, customerPhone, totalAmount);
  };
}

function closePopup() {
  buyNowPopup.style.display = 'none';
}

window.onclick = function (event) {
  if (event.target === buyNowPopup) {
    closePopup();
  }
};

function placeOrder(customerName, customerPhone, totalAmount) {

  const orderPromises = cart.map(item => {
    const orderDetails = {
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.quantity,
      customerName: customerName,
      customerPhone: customerPhone,
      totalAmount: totalAmount,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    return db.collection('orders').add(orderDetails);
  });

  
  Promise.all(orderPromises)
    .then(() => {
      alert('Orders placed successfully!');
      closePopup();
      cart = []; 
      localStorage.removeItem('cart');
      displayCart();
    })
    .catch((error) => {
      console.error('Error placing orders: ', error);
    });
}

function updateTotalAmount() {
  const totalAmount = cart.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  totalAmountField.textContent = `Total Amount: ₹${totalAmount}`;
}

document.addEventListener('DOMContentLoaded', () => {
  displayCart();
});
