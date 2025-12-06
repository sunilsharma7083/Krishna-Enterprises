// Admin Authentication
// API_BASE is loaded from config.js

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
});

// Check if admin is authenticated
async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE}/admin/check-auth`);
    const result = await response.json();
    
    if (result.success && result.isAuthenticated) {
      showDashboard(result.username);
    } else {
      showLoginPage();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showLoginPage();
  }
}

// Show login page
function showLoginPage() {
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');
}

// Show dashboard
function showDashboard(username) {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('admin-dashboard').classList.remove('hidden');
  document.getElementById('admin-username').textContent = username || 'Admin';
  
  // Load dashboard by default
  loadDashboard();
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  const errorMessage = document.getElementById('login-error-message');
  const submitButton = e.target.querySelector('button[type="submit"]');
  
  // Hide previous errors
  errorDiv.classList.add('hidden');
  
  // Disable submit button
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';
  
  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showDashboard(result.data.name);
    } else {
      errorMessage.textContent = result.message || 'Invalid credentials';
      errorDiv.classList.remove('hidden');
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Login';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = 'Login failed. Please try again.';
    errorDiv.classList.remove('hidden');
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>Login';
  }
});

// Logout function
async function logout() {
  try {
    await fetch(`${API_BASE}/admin/logout`, { method: 'POST' });
    showLoginPage();
    
    // Reset form
    document.getElementById('login-form').reset();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Update active sidebar link
function updateSidebarActive(linkText) {
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    link.classList.remove('active');
    if (link.textContent.trim().includes(linkText)) {
      link.classList.add('active');
    }
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-xl"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format currency
function formatCurrency(amount) {
  return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
