var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');

/* ---------------- CART OPEN/CLOSE ---------------- */
cartIcon.addEventListener('click', () => cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'));

/* ---------------- MOBILE MENU ---------------- */
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('mobile-menu-active');
  bars.classList.toggle('fa-bars');
  bars.classList.toggle('fa-xmark');
});

let productList = [];
let cartProduct = [];

/* ---------------- UPDATE TOTAL ---------------- */
const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  cartProduct.forEach(item => {
    totalPrice += item.priceNumber * item.qty;
    totalQuantity += item.qty;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

/* ---------------- SHOW PRODUCTS ---------------- */
const showCards = () => {
  productList.forEach(product => {

    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');

    orderCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn card-btn">Add to cart</a>
    `;

    cardList.appendChild(orderCard);

    orderCard.querySelector('.card-btn').addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });
};

/* ---------------- ADD TO CART ---------------- */
const addToCart = (product) => {

  const existingProduct = cartProduct.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.qty++;
    renderCart();
    return;
  }

  cartProduct.push({
    ...product,
    qty: 1,
    priceNumber: parseFloat(product.price.replace('$',''))
  });

  renderCart();
};

/* ---------------- RENDER CART ---------------- */
const renderCart = () => {

  cartList.innerHTML = "";

  cartProduct.forEach(product => {

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">$${(product.priceNumber * product.qty).toFixed(2)}</h4>
        </div>
        <div style="display:flex;">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">${product.qty}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>
    `;

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');

    plusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      product.qty++;
      renderCart();
    });

    minusBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (product.qty > 1) {
        product.qty--;
        renderCart();
      } else {
        cartItem.classList.add('slide-out'); 
        setTimeout(() => {
          cartProduct = cartProduct.filter(p => p.id !== product.id);
          renderCart();
        }, 300);
      }
    });

    cartList.appendChild(cartItem);
  });

  updateTotals();
};

/* ---------------- INIT ---------------- */
const initApp = () => {
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      productList = data;
      showCards();
    })
    .catch(err => console.log(err));
};

initApp();