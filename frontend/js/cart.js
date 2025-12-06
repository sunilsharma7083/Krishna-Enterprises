// Cart Management
let cart = [];

// Initialize cart from localStorage
function initializeCart() {
  const savedCart = localStorage.getItem('krishna_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartBadge();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('krishna_cart', JSON.stringify(cart));
  updateCartBadge();
}

// Add item to cart
function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item.productId === product._id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'
    });
  }
  
  saveCart();
  showToast(`${product.title} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveCart();
  if (currentPage === 'cart') {
    viewCart(); // Reload cart page
  }
  showToast('Item removed from cart', 'info');
}

// Update item quantity
function updateQuantity(productId, quantity) {
  const item = cart.find(item => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart();
      if (currentPage === 'cart') {
        viewCart(); // Reload cart page
      }
    }
  }
}

// Get cart total
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart items count
function getCartItemsCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart badge
function updateCartBadge() {
  const count = getCartItemsCount();
  const badge = document.getElementById('cart-badge');
  const badgeMobile = document.getElementById('cart-badge-mobile');
  
  if (count > 0) {
    if (badge) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    }
    if (badgeMobile) {
      badgeMobile.textContent = count;
      badgeMobile.classList.remove('hidden');
    }
  } else {
    if (badge) badge.classList.add('hidden');
    if (badgeMobile) badgeMobile.classList.add('hidden');
  }
}

// View Cart Page
function viewCart() {
  currentPage = 'cart';
  window.location.hash = 'cart';
  const content = document.getElementById('app-content');
  
  if (cart.length === 0) {
    content.innerHTML = `
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-2xl mx-auto text-center">
          <i class="fas fa-shopping-cart text-8xl text-gray-300 mb-6"></i>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p class="text-gray-600 mb-8">Add some amazing trophies to your cart!</p>
          <button onclick="loadHomePage()" class="gold-gradient text-gray-900 font-semibold px-8 py-4 rounded-lg hover:shadow-xl transition">
            <i class="fas fa-shopping-bag mr-2"></i>Continue Shopping
          </button>
        </div>
      </div>
    `;
    return;
  }
  
  const cartItemsHTML = cart.map(item => `
    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 items-center">
      <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded-lg" onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100?text=Trophy';">
      <div class="flex-grow text-center md:text-left">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">${item.title}</h3>
        <p class="text-yellow-600 font-bold text-lg">${formatCurrency(item.price)}</p>
      </div>
      <div class="flex items-center space-x-4">
        <button onclick="updateQuantity('${item.productId}', ${item.quantity - 1})" 
                class="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
          <i class="fas fa-minus"></i>
        </button>
        <span class="text-xl font-semibold w-12 text-center">${item.quantity}</span>
        <button onclick="updateQuantity('${item.productId}', ${item.quantity + 1})" 
                class="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-gray-900 mb-2">${formatCurrency(item.price * item.quantity)}</p>
        <button onclick="removeFromCart('${item.productId}')" 
                class="text-red-500 hover:text-red-700 transition">
          <i class="fas fa-trash mr-1"></i>Remove
        </button>
      </div>
    </div>
  `).join('');
  
  const total = getCartTotal();
  
  content.innerHTML = `
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            ${cartItemsHTML}
          </div>
          
          <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div class="space-y-4 mb-6">
                <div class="flex justify-between text-gray-700">
                  <span>Subtotal (${getCartItemsCount()} items)</span>
                  <span class="font-semibold">${formatCurrency(total)}</span>
                </div>
                <div class="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span class="text-yellow-600">${formatCurrency(total)}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <button onclick="proceedToCheckout()" 
                        class="w-full gold-gradient text-gray-900 font-semibold px-6 py-4 rounded-lg hover:shadow-xl transition">
                  <i class="fas fa-shopping-bag mr-2"></i>Proceed to Checkout
                </button>
                <button onclick="orderViaWhatsApp()" 
                        class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-lg transition">
                  <i class="fab fa-whatsapp mr-2"></i>Order via WhatsApp
                </button>
                <button onclick="loadHomePage()" 
                        class="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-4 rounded-lg transition">
                  <i class="fas fa-arrow-left mr-2"></i>Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  window.scrollTo(0, 0);
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  loadCheckoutPage();
}

// Order via WhatsApp from cart
function orderViaWhatsApp() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  
  let message = 'Hello Krishna Enterprises, I want to order:\n\n';
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.title}\n   Quantity: ${item.quantity}\n   Price: ₹${item.price} each\n   Subtotal: ₹${item.price * item.quantity}\n\n`;
  });
  
  message += `Total Amount: ₹${getCartTotal()}\n\n`;
  message += 'Please confirm my order. I will provide my delivery details.';
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/919782070381?text=${encodedMessage}`;
  
  window.open(whatsappURL, '_blank');
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  showToast('Cart cleared', 'info');
}

// Initialize cart on load
initializeCart();
