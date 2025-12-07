// User Authentication Management
// API_BASE is loaded from config.js

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
  await checkUserAuth();
  setupAuthForms();
});

// Check if user is authenticated
async function checkUserAuth() {
  try {
    const response = await fetch(`${API_BASE}/auth/check-auth`);
    const result = await response.json();
    
    if (result.success && result.isAuthenticated) {
      showUserMenu(result.name);
    } else {
      showAuthButtons();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showAuthButtons();
  }
}

// Show authenticated user menu
function showUserMenu(userName) {
  document.getElementById('auth-buttons').classList.add('hidden');
  document.getElementById('user-menu').classList.remove('hidden');
  document.getElementById('user-name-desktop').textContent = userName.split(' ')[0];
  
  // Mobile
  document.getElementById('mobile-auth-buttons').classList.add('hidden');
  document.getElementById('mobile-user-menu').classList.remove('hidden');
}

// Show login/signup buttons
function showAuthButtons() {
  document.getElementById('auth-buttons').classList.remove('hidden');
  document.getElementById('user-menu').classList.add('hidden');
  
  // Mobile
  document.getElementById('mobile-auth-buttons').classList.remove('hidden');
  document.getElementById('mobile-user-menu').classList.add('hidden');
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById('user-dropdown');
  dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.getElementById('user-menu');
  const dropdown = document.getElementById('user-dropdown');
  if (userMenu && !userMenu.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// Show login modal
function showLoginModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('auth-modal-title').textContent = 'Login';
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').reset();
}

// Close auth modal
function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

// Switch to signup form
function switchToSignup() {
  document.getElementById('auth-modal-title').textContent = 'Sign Up';
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
  document.getElementById('signup-form').reset();
}

// Switch to login form
function switchToLogin() {
  document.getElementById('auth-modal-title').textContent = 'Login';
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('login-form').reset();
}

// Setup authentication forms
function setupAuthForms() {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Login successful! Welcome back!', 'success');
      closeAuthModal();
      showUserMenu(result.data.name);
      
      // Reload current page content if needed
      if (currentPage === 'checkout') {
        loadCheckoutPage();
      }
    } else {
      showToast(result.message || 'Login failed', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Login failed. Please try again.', 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// Handle signup
async function handleSignup(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Account created successfully! Welcome!', 'success');
      closeAuthModal();
      showUserMenu(result.data.name);
    } else {
      showToast(result.message || 'Signup failed', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  } catch (error) {
    console.error('Signup error:', error);
    showToast('Signup failed. Please try again.', 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// User logout
async function userLogout() {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST'
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Logged out successfully', 'success');
      showAuthButtons();
      
      // Redirect to home if on protected page
      if (currentPage === 'profile' || currentPage === 'my-orders') {
        loadHomePage();
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
    showToast('Logout failed', 'error');
  }
}

// View user profile
async function viewProfile() {
  currentPage = 'profile';
  const content = document.getElementById('app-content');
  
  content.innerHTML = '<div class="container mx-auto px-4 py-16"><div class="flex justify-center"><div class="spinner"></div></div></div>';
  
  try {
    const response = await fetch(`${API_BASE}/auth/profile`);
    const result = await response.json();
    
    if (!result.success) {
      showToast('Please login to view profile', 'error');
      showLoginModal();
      loadHomePage();
      return;
    }
    
    const user = result.data;
    
    content.innerHTML = `
      <div class="bg-gray-50 py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <h1 class="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>
            
            <div class="bg-white rounded-lg shadow-md p-8">
              <form id="profile-form" class="space-y-6">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input type="text" id="profile-name" value="${user.name}"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                </div>
                
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" value="${user.email}" disabled
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
                  <p class="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input type="tel" id="profile-phone" value="${user.phone || ''}"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                </div>
                
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Address</label>
                  <div class="grid md:grid-cols-2 gap-4">
                    <input type="text" id="profile-street" placeholder="Street Address" value="${user.address?.street || ''}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <input type="text" id="profile-city" placeholder="City" value="${user.address?.city || ''}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <input type="text" id="profile-state" placeholder="State" value="${user.address?.state || ''}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <input type="text" id="profile-pincode" placeholder="PIN Code" value="${user.address?.pincode || ''}"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  </div>
                </div>
                
                <div class="flex space-x-4">
                  <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
                    <i class="fas fa-save mr-2"></i>Update Profile
                  </button>
                  <button type="button" onclick="loadHomePage()" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup form submission
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error loading profile:', error);
    showToast('Failed to load profile', 'error');
    loadHomePage();
  }
}

// Handle profile update
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Updating...';
  
  const profileData = {
    name: document.getElementById('profile-name').value.trim(),
    phone: document.getElementById('profile-phone').value.trim(),
    address: {
      street: document.getElementById('profile-street').value.trim(),
      city: document.getElementById('profile-city').value.trim(),
      state: document.getElementById('profile-state').value.trim(),
      pincode: document.getElementById('profile-pincode').value.trim()
    }
  };
  
  try {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Profile updated successfully!', 'success');
      // Update displayed name
      showUserMenu(result.data.name);
    } else {
      showToast(result.message || 'Update failed', 'error');
    }
    
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  } catch (error) {
    console.error('Profile update error:', error);
    showToast('Update failed. Please try again.', 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// View my orders
async function viewMyOrders() {
  try {
    // Get user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.email && !user.phone) {
      showToast('Please update your profile with email or phone first', 'error');
      return;
    }

    // Fetch orders from API
    const response = await fetch(`${API_BASE}/orders/my-orders?email=${user.email || ''}&phone=${user.phone || ''}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const result = await response.json();
    const orders = result.data || [];

    if (orders.length === 0) {
      showOrdersModal([]);
      return;
    }

    showOrdersModal(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    showToast('Failed to load orders. Please try again.', 'error');
  }
}

// Show orders in modal
function showOrdersModal(orders) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="sticky top-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 p-6 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold flex items-center">
            <i class="fas fa-shopping-bag mr-3"></i>
            My Orders
          </h2>
          <p class="text-sm text-gray-700 mt-1">${orders.length} order(s) found</p>
        </div>
        <button onclick="this.closest('.fixed').remove()" 
                class="text-gray-900 hover:text-gray-700 text-2xl font-bold">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="p-6">
        ${orders.length === 0 ? `
          <div class="text-center py-12">
            <i class="fas fa-shopping-cart text-gray-300 text-6xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
            <p class="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button onclick="this.closest('.fixed').remove(); window.location.hash='#products'" 
                    class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg">
              <i class="fas fa-shopping-bag mr-2"></i>Start Shopping
            </button>
          </div>
        ` : `
          <div class="space-y-4">
            ${orders.map(order => `
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-bold text-gray-900">
                        Order #${order.orderNumber}
                      </h3>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }">
                        ${order.status.toUpperCase()}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      <i class="fas fa-calendar mr-2"></i>
                      ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div class="text-left md:text-right">
                    <p class="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p class="text-2xl font-bold text-yellow-600">₹${order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                    <i class="fas fa-box mr-2 text-yellow-600"></i>
                    Order Items (${order.items.length})
                  </h4>
                  <div class="space-y-2">
                    ${order.items.map(item => `
                      <div class="flex items-center gap-3 bg-white p-3 rounded-lg hover:shadow-md transition cursor-pointer"
                           onclick="window.location.hash='#products'; document.querySelector('.fixed')?.remove();">
                        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          ${item.productId && item.productId.images && item.productId.images.length > 0 ? `
                            <img src="${item.productId.images[0]}" 
                                 alt="${item.title}" 
                                 class="w-full h-full object-cover"
                                 onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1614292253918-c5c8d5ba1f1c?w=100&h=100&fit=crop';">
                          ` : `
                            <div class="w-full h-full flex items-center justify-center">
                              <i class="fas fa-trophy text-yellow-400 text-2xl"></i>
                            </div>
                          `}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-semibold text-gray-900 truncate">${item.title}</p>
                          <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                        </div>
                        <div class="text-right">
                          <p class="font-semibold text-gray-900">₹${item.price.toLocaleString('en-IN')}</p>
                          <p class="text-xs text-gray-500">per item</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="font-semibold text-gray-900 mb-2 flex items-center">
                      <i class="fas fa-user mr-2 text-blue-600"></i>
                      Customer Details
                    </p>
                    <p class="text-gray-700"><strong>Name:</strong> ${order.customerName}</p>
                    ${order.email ? `<p class="text-gray-700"><strong>Email:</strong> ${order.email}</p>` : ''}
                    <p class="text-gray-700"><strong>Phone:</strong> ${order.phone}</p>
                  </div>
                  <div class="bg-green-50 p-3 rounded-lg">
                    <p class="font-semibold text-gray-900 mb-2 flex items-center">
                      <i class="fas fa-map-marker-alt mr-2 text-green-600"></i>
                      Delivery Address
                    </p>
                    <p class="text-gray-700">${order.address}</p>
                    <p class="text-gray-700">${order.city}, ${order.state} - ${order.pincode}</p>
                  </div>
                </div>

                ${order.message ? `
                  <div class="mt-4 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p class="font-semibold text-gray-900 mb-1">
                      <i class="fas fa-comment mr-2 text-yellow-600"></i>
                      Order Message
                    </p>
                    <p class="text-gray-700 text-sm">${order.message}</p>
                  </div>
                ` : ''}

                <div class="mt-4 flex flex-wrap gap-2">
                  <button onclick="window.open('https://wa.me/917014881124?text=Hi, I have a question about Order ${order.orderNumber}', '_blank')"
                          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <i class="fab fa-whatsapp"></i> Contact on WhatsApp
                  </button>
                  ${order.status === 'pending' ? `
                    <button onclick="alert('To cancel order, please contact us on WhatsApp')"
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <i class="fas fa-times-circle"></i> Request Cancel
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <div class="sticky bottom-0 bg-gray-50 p-4 flex justify-end gap-3 border-t">
        <button onclick="this.closest('.fixed').remove()" 
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-lg">
          Close
        </button>
        <button onclick="window.location.hash='#products'; this.closest('.fixed').remove()" 
                class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg">
          <i class="fas fa-shopping-bag mr-2"></i>Continue Shopping
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}
