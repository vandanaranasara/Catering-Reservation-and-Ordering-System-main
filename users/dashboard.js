
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

const productList = document.getElementById('productList');
const buyNowPopup = document.getElementById('buyNowPopup');
const buyNowForm = document.getElementById('buyNowForm');
const totalAmountField = document.getElementById('totalAmount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayProducts() {
  db.collection('products').get()
    .then((querySnapshot) => {
      productList.innerHTML = ''; 
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <img src="${product.productImage}" alt="${product.productName}">
          <h3>${product.productName}</h3>
          <p>Price: ₹${product.productPrice}</p>
          <div class="product-actions">
            <button class="buy-now-button" data-id="${product.productId}" data-price="${product.productPrice}">Buy Now</button>
            <button class="add-to-cart-button" data-id="${product.productId}">Add to Cart</button>
          </div>
        `;
        productList.appendChild(productCard);
      });

      const buyNowButtons = document.querySelectorAll('.buy-now-button');
      buyNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          openPopup(e.target.dataset.id, e.target.dataset.price);
        });
      });

      const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
      addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          addToCart(e.target.dataset.id);
        });
      });
    })
    .catch((error) => {
      console.error('Error getting products: ', error);
    });
}

function addToCart(productId) {
  
  db.collection('products').doc(productId).get()
    .then((doc) => {
      if (doc.exists) {
        const product = doc.data();
        const cartItem = {
          productId: productId,
          productName: product.productName,
          productPrice: product.productPrice,
          quantity: 1, 
          productImage: product.productImage 
        };

        
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        
        updateCartCount();

        
        alert('Product added to cart successfully!');
      } else {
        console.error('No such product!');
      }
    })
    .catch((error) => {
      console.error('Error fetching product: ', error);
    });
}

function updateCartCount() {
  const cartCountElement = document.getElementById('cartCount');
  cartCountElement.textContent = cart.length;
}

function openPopup(productId, productPrice) {
  buyNowPopup.style.display = 'block';
  const quantityInput = buyNowForm.querySelector('input[name="quantity"]');
  quantityInput.value = 1; 
  updateTotalAmount(productPrice, quantityInput.value); 
  quantityInput.addEventListener('input', () => {
    updateTotalAmount(productPrice, quantityInput.value);
  });

  buyNowForm.onsubmit = function (e) {
    e.preventDefault();
    const quantity = quantityInput.value;
    const customerName = buyNowForm.querySelector('input[name="name"]').value;
    const customerPhone = buyNowForm.querySelector('input[name="phone"]').value;
    const totalAmount = parseFloat(totalAmountField.value.replace('₹', '')); 

    placeOrder(productId, quantity, customerName, customerPhone, totalAmount);
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

function placeOrder(productId, quantity, customerName, customerPhone, totalAmount) {
  
  db.collection('products').doc(productId).get()
    .then((doc) => {
      if (doc.exists) {
        const product = doc.data();
        
        db.collection('orders').add({
          productId: productId,
          productName: product.productName, 
          quantity: quantity,
          customerName: customerName,
          customerPhone: customerPhone,
          totalAmount: totalAmount,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          alert('Order placed successfully!');
          closePopup();
        })
        .catch((error) => {
          console.error('Error placing order: ', error);
        });
      } else {
        console.error('No such product!');
      }
    })
    .catch((error) => {
      console.error('Error fetching product: ', error);
    });
}

function updateTotalAmount(productPrice, quantity) {
  const totalAmount = productPrice * quantity;
  totalAmountField.value = `₹${totalAmount}`; 
}

document.addEventListener('DOMContentLoaded', displayProducts);
