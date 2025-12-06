// User Authentication Management
const API_BASE = 'https://krishna-enterprises-9oup.onrender.com/api';

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

// View my orders (placeholder - you can implement full order history)
function viewMyOrders() {
  showToast('Order history feature coming soon!', 'info');
}
