// Orders Management

// Load checkout page
function loadCheckoutPage() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    loadHomePage();
    return;
  }
  
  currentPage = 'checkout';
  window.location.hash = 'checkout';
  const content = document.getElementById('app-content');
  
  const cartItemsHTML = cart.map(item => `
    <div class="flex items-center justify-between py-3 border-b">
      <div class="flex items-center space-x-3">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded" onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100?text=Trophy';">
        <div>
          <p class="font-semibold text-gray-900">${item.title}</p>
          <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
        </div>
      </div>
      <p class="font-semibold text-gray-900">${formatCurrency(item.price * item.quantity)}</p>
    </div>
  `).join('');
  
  const total = getCartTotal();
  
  content.innerHTML = `
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2">
            <div class="bg-white p-8 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
              
              <form id="checkout-form" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Full Name *</label>
                    <input type="text" 
                           id="customer-name" 
                           required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                           placeholder="Enter your full name">
                  </div>
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input type="email" 
                           id="customer-email"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                           placeholder="your.email@example.com">
                  </div>
                </div>
                
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                  <input type="tel" 
                         id="customer-phone" 
                         required
                         pattern="[0-9]{10}"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                         placeholder="10-digit mobile number">
                </div>
                
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Full Address *</label>
                  <textarea id="customer-address" 
                            required
                            rows="3"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="House/Flat No., Street, Locality"></textarea>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">City *</label>
                    <input type="text" 
                           id="customer-city" 
                           required
                           value="Jaipur"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  </div>
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">State *</label>
                    <input type="text" 
                           id="customer-state" 
                           required
                           value="Rajasthan"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  </div>
                  <div>
                    <label class="block text-gray-700 font-semibold mb-2">PIN Code *</label>
                    <input type="text" 
                           id="customer-pincode" 
                           required
                           pattern="[0-9]{6}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                           placeholder="6-digit PIN">
                  </div>
                </div>
                
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Special Instructions (Optional)</label>
                  <textarea id="customer-message" 
                            rows="3"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Any special requirements or messages"></textarea>
                </div>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p class="text-sm text-yellow-800">
                    <i class="fas fa-info-circle mr-2"></i>
                    <strong>Note:</strong> You can place your order either by submitting this form or by ordering directly via WhatsApp.
                  </p>
                </div>
                
                <div class="flex flex-col md:flex-row gap-4">
                  <button type="submit" 
                          class="flex-1 gold-gradient text-gray-900 font-semibold px-8 py-4 rounded-lg hover:shadow-xl transition text-lg">
                    <i class="fas fa-check mr-2"></i>Place Order
                  </button>
                  <button type="button"
                          onclick="orderViaWhatsAppCheckout()" 
                          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg">
                    <i class="fab fa-whatsapp mr-2"></i>Order via WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div class="space-y-2 mb-6 max-h-80 overflow-y-auto">
                ${cartItemsHTML}
              </div>
              
              <div class="border-t pt-4 space-y-3">
                <div class="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span class="font-semibold">${formatCurrency(total)}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span class="font-semibold text-green-600">To be confirmed</span>
                </div>
                <div class="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span class="text-yellow-600">${formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Setup form submission
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', handleCheckoutSubmit);
  
  window.scrollTo(0, 0);
}

// Handle checkout form submission
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
  
  const orderData = {
    customerName: document.getElementById('customer-name').value.trim(),
    email: document.getElementById('customer-email').value.trim(),
    phone: document.getElementById('customer-phone').value.trim(),
    address: document.getElementById('customer-address').value.trim(),
    city: document.getElementById('customer-city').value.trim(),
    state: document.getElementById('customer-state').value.trim(),
    pincode: document.getElementById('customer-pincode').value.trim(),
    message: document.getElementById('customer-message').value.trim(),
    items: cart,
    totalAmount: getCartTotal()
  };
  
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      showOrderSuccess(result.data);
      clearCart();
    } else {
      showToast(result.message || 'Failed to place order', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  } catch (error) {
    console.error('Error placing order:', error);
    showToast('Failed to place order. Please try again.', 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// Show order success page
function showOrderSuccess(order) {
  currentPage = 'order-success';
  const content = document.getElementById('app-content');
  
  const whatsappMessage = encodeURIComponent(
    `Hello Krishna Enterprises,\n\nMy order has been placed successfully!\n\n` +
    `Order Number: ${order.orderNumber}\n` +
    `Name: ${order.customerName}\n` +
    `Phone: ${order.phone}\n` +
    `Address: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}\n\n` +
    `Total Amount: ₹${order.totalAmount}\n\n` +
    `Please confirm my order and delivery details.`
  );
  
  content.innerHTML = `
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-check text-white text-4xl"></i>
          </div>
          
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p class="text-xl text-gray-600 mb-8">Thank you for your order, ${order.customerName}!</p>
          
          <div class="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8">
            <p class="text-lg font-semibold text-gray-900 mb-2">Order Number</p>
            <p class="text-3xl font-bold text-yellow-600">${order.orderNumber}</p>
          </div>
          
          <div class="text-left bg-gray-50 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            
            <div class="space-y-3 mb-6">
              ${order.items.map(item => `
                <div class="flex justify-between items-center py-2 border-b">
                  <div>
                    <p class="font-semibold text-gray-900">${item.title}</p>
                    <p class="text-sm text-gray-500">Qty: ${item.quantity} × ₹${item.price}</p>
                  </div>
                  <p class="font-semibold text-gray-900">${formatCurrency(item.price * item.quantity)}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="border-t pt-4">
              <div class="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Amount</span>
                <span class="text-yellow-600">${formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t">
              <h4 class="font-semibold text-gray-900 mb-2">Delivery Address</h4>
              <p class="text-gray-700">
                ${order.customerName}<br>
                ${order.phone}<br>
                ${order.address}<br>
                ${order.city}, ${order.state} - ${order.pincode}
              </p>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p class="text-gray-700">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              Our team will contact you shortly to confirm your order and delivery details. 
              You can also reach us directly on WhatsApp.
            </p>
          </div>
          
          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <a href="https://wa.me/919782070381?text=${whatsappMessage}" 
               target="_blank"
               class="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition">
              <i class="fab fa-whatsapp mr-2"></i>Contact on WhatsApp
            </a>
            <button onclick="loadHomePage()" 
                    class="gold-gradient text-gray-900 font-semibold px-8 py-4 rounded-lg hover:shadow-xl transition">
              <i class="fas fa-home mr-2"></i>Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  window.scrollTo(0, 0);
}

// Order via WhatsApp from checkout page
function orderViaWhatsAppCheckout() {
  // Get form values
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const city = document.getElementById('customer-city').value.trim();
  const state = document.getElementById('customer-state').value.trim();
  const pincode = document.getElementById('customer-pincode').value.trim();
  const message = document.getElementById('customer-message').value.trim();
  
  let whatsappMessage = 'Hello Krishna Enterprises, I want to place an order:\n\n';
  
  // Add products
  whatsappMessage += '*Products:*\n';
  cart.forEach((item, index) => {
    whatsappMessage += `${index + 1}. ${item.title}\n   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n\n`;
  });
  
  whatsappMessage += `*Total Amount: ₹${getCartTotal()}*\n\n`;
  
  // Add customer details if provided
  if (name) whatsappMessage += `*Name:* ${name}\n`;
  if (phone) whatsappMessage += `*Phone:* ${phone}\n`;
  if (address) whatsappMessage += `*Address:* ${address}\n`;
  if (city) whatsappMessage += `*City:* ${city}\n`;
  if (state) whatsappMessage += `*State:* ${state}\n`;
  if (pincode) whatsappMessage += `*PIN:* ${pincode}\n`;
  if (message) whatsappMessage += `\n*Special Instructions:* ${message}\n`;
  
  whatsappMessage += '\nPlease confirm my order.';
  
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/919782070381?text=${encodedMessage}`;
  
  window.open(whatsappURL, '_blank');
}
