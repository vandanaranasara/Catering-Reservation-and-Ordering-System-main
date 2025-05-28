
function closePopup() {
  const addProductPopup = document.getElementById('addProductPopup');
  addProductPopup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const openPopupButton = document.getElementById('openPopupButton');
  const addProductPopup = document.getElementById('addProductPopup');
  const productList = document.getElementById('productList');
  let editingProductId = null; 

  openPopupButton.addEventListener('click', function() {
    addProductPopup.style.display = 'block';
  });

  
  window.onclick = function(event) {
    if (event.target === addProductPopup) {
      addProductPopup.style.display = 'none';
      editingProductId = null; 
    }
  };

  
  const addProductForm = document.getElementById('addProductForm');
  addProductForm.addEventListener('submit', function(e) {
    e.preventDefault();


    const productId = addProductForm['productId'].value;
    const productName = addProductForm['productName'].value;
    const productImage = addProductForm['productImage'].value;
    const productPrice = addProductForm['productPrice'].value;

    if (editingProductId) {
      
      firebase.firestore().collection('products').doc(editingProductId).update({
        productId: productId,
        productName: productName,
        productImage: productImage,
        productPrice: parseFloat(productPrice)  
      })
      .then(() => {
        console.log('Product updated with ID: ', editingProductId);
       
        addProductForm.reset();
        
        closePopup();
        
        const updatedProductCard = document.getElementById(`product-${editingProductId}`);
        updatedProductCard.innerHTML = `
          <img src="${productImage}" alt="${productName}">
          <h3>${productName}</h3>
          <p>ID: ${productId}</p>
          <p>Price: ₹${productPrice}</p>
          <div class="product-actions">
            <button onclick="editProduct('${editingProductId}')">Edit</button>
            <button onclick="deleteProduct('${editingProductId}')">Delete</button>
          </div>
        `;
      })
      .catch((error) => {
        console.error('Error updating product: ', error);
      });
    } else {
      
      firebase.firestore().collection('products').doc(productId).set({
        productId: productId,
        productName: productName,
        productImage: productImage,
        productPrice: parseFloat(productPrice)  
      })
      .then(() => {
        console.log('Product added with ID: ', productId);

       
        addProductForm.reset();
       
        closePopup();

       
        const productCard = document.createElement('div');
        productCard.id = `product-${productId}`;
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <img src="${productImage}" alt="${productName}">
          <h3>${productName}</h3>
          <p>ID: ${productId}</p>
          <p>Price: ₹${productPrice}</p>
          <div class="product-actions">
            <button onclick="editProduct('${productId}')">Edit</button>
            <button onclick="deleteProduct('${productId}')">Delete</button>
          </div>
        `;

       
        productList.appendChild(productCard);
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
    }
  });


  function displayProducts() {
    firebase.firestore().collection('products').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const product = doc.data();
          const productCard = document.createElement('div');
          productCard.id = `product-${doc.id}`;
          productCard.classList.add('product-card');
          productCard.innerHTML = `
            <img src="${product.productImage}" alt="${product.productName}">
            <h3>${product.productName}</h3>
            <p>ID: ${product.productId}</p>
            <p>Price: ₹${product.productPrice}</p>
            <div class="product-actions">
              <button onclick="editProduct('${doc.id}')">Edit</button>
              <button onclick="deleteProduct('${doc.id}')">Delete</button>
            </div>
          `;
          productList.appendChild(productCard);
        });
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }


  displayProducts();


  window.editProduct = function(productId) {
    const productRef = firebase.firestore().collection('products').doc(productId);
    productRef.get()
      .then((doc) => {
        if (doc.exists) {
          const productData = doc.data();
        
          addProductForm['productId'].value = productData.productId;
          addProductForm['productName'].value = productData.productName;
          addProductForm['productImage'].value = productData.productImage;
          addProductForm['productPrice'].value = productData.productPrice;
   
          addProductPopup.style.display = 'block';
          editingProductId = productId; 
        } else {
          console.error('No such product document!');
        }
      })
      .catch((error) => {
        console.error('Error getting product document: ', error);
      });
  };


  window.deleteProduct = function(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      firebase.firestore().collection('products').doc(productId).delete()
        .then(() => {
          console.log('Product successfully deleted!');
         
          const deletedProductCard = document.getElementById(`product-${productId}`);
          deletedProductCard.remove();
        })
        .catch((error) => {
          console.error('Error removing product: ', error);
        });
    }
  };
});
