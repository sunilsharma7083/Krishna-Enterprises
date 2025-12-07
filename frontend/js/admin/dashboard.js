// Admin Dashboard

// Load dashboard
async function loadDashboard() {
  updateSidebarActive('Dashboard');
  const content = document.getElementById('admin-content');
  
  content.innerHTML = '<div class="flex justify-center py-12"><div class="spinner"></div></div>';
  
  try {
    // Fetch dashboard statistics
    const response = await fetch(`${API_BASE}/orders/stats/dashboard`, {
      credentials: 'include'
    });
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('Failed to load dashboard stats');
    }
    
    const stats = result.data;
    
    // Fetch recent orders
    const ordersResponse = await fetch(`${API_BASE}/orders?limit=5`, {
      credentials: 'include'
    });
    const ordersResult = await ordersResponse.json();
    const recentOrders = ordersResult.success ? ordersResult.data.slice(0, 5) : [];
    
    content.innerHTML = `
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-shopping-cart text-blue-600 text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-gray-900">${stats.totalOrders}</span>
          </div>
          <h3 class="text-gray-600 font-semibold">Total Orders</h3>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-gray-900">${stats.newOrders}</span>
          </div>
          <h3 class="text-gray-600 font-semibold">New Orders</h3>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-spinner text-purple-600 text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-gray-900">${stats.processingOrders}</span>
          </div>
          <h3 class="text-gray-600 font-semibold">Processing</h3>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-gray-900">${stats.deliveredOrders}</span>
          </div>
          <h3 class="text-gray-600 font-semibold">Delivered</h3>
        </div>
      </div>
      
      <!-- Revenue Card -->
      <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-8 mb-8">
        <div class="flex items-center justify-between text-white">
          <div>
            <p class="text-yellow-100 mb-2">Total Revenue</p>
            <h2 class="text-4xl font-bold">${formatCurrency(stats.totalRevenue)}</h2>
          </div>
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-rupee-sign text-3xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Recent Orders</h2>
          <button onclick="loadOrders()" class="text-yellow-600 hover:text-yellow-700 font-semibold">
            View All <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        
        ${recentOrders.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Order #</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                ${recentOrders.map(order => `
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 font-semibold text-gray-900">${order.orderNumber}</td>
                    <td class="py-3 px-4 text-gray-700">${order.customerName}</td>
                    <td class="py-3 px-4 text-gray-600 text-sm">${formatDate(order.orderDate)}</td>
                    <td class="py-3 px-4 font-semibold text-gray-900">${formatCurrency(order.totalAmount)}</td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}">
                        ${order.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="text-center py-12 text-gray-500">
            <i class="fas fa-inbox text-4xl mb-3"></i>
            <p>No orders yet</p>
          </div>
        `}
      </div>
    `;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    content.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
        <p class="text-red-800">Failed to load dashboard. Please try again.</p>
      </div>
    `;
  }
}

// Load categories management page
function loadCategories() {
  updateSidebarActive('Categories');
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Product Categories</h1>
          <p class="text-gray-600 mt-2">Manage product categories displayed on the home page</p>
        </div>
        <button onclick="showCategoryForm()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition">
          <i class="fas fa-plus mr-2"></i>Add Category
        </button>
      </div>
    </div>
    
    <!-- Loading Indicator -->
    <div id="loadingIndicator" class="hidden flex justify-center py-12">
      <div class="spinner"></div>
    </div>
    
    <!-- Categories Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left py-4 px-4 text-gray-600 font-semibold">Name</th>
              <th class="text-left py-4 px-4 text-gray-600 font-semibold">Description</th>
              <th class="text-center py-4 px-4 text-gray-600 font-semibold">Order</th>
              <th class="text-center py-4 px-4 text-gray-600 font-semibold">Status</th>
              <th class="text-center py-4 px-4 text-gray-600 font-semibold">Created</th>
              <th class="text-center py-4 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody id="categoriesTableBody">
            <tr>
              <td colspan="6" class="text-center py-8">
                <div class="spinner mx-auto"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Category Form Modal -->
    <div id="categoryFormModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 id="categoryFormTitle" class="text-2xl font-bold text-gray-900">Add New Category</h2>
          <button onclick="hideCategoryForm()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>
        
        <form id="categoryForm" onsubmit="saveCategory(event)" class="p-6 space-y-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Category Name *</label>
            <input type="text" 
                   id="categoryName" 
                   required
                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                   placeholder="e.g., Trophies, Awards, Medals">
          </div>
          
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea id="categoryDescription" 
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Brief description of the category"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Icon (Font Awesome Class)</label>
              <input type="text" 
                     id="categoryIcon" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                     placeholder="fa-trophy"
                     value="fa-folder">
              <p class="text-xs text-gray-500 mt-1">Example: fa-trophy, fa-award, fa-medal, fa-gem</p>
            </div>
            
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Display Order</label>
              <input type="number" 
                     id="categoryDisplayOrder" 
                     min="0"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                     placeholder="0"
                     value="0">
              <p class="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" 
                   id="categoryActive" 
                   checked
                   class="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400">
            <label for="categoryActive" class="ml-3 text-gray-700 font-semibold">Active (visible on home page)</label>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" 
                    onclick="hideCategoryForm()"
                    class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" 
                    class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition">
              <i class="fas fa-save mr-2"></i>Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Initialize categories page
  if (typeof window.initCategoriesAdmin === 'function') {
    window.initCategoriesAdmin();
  }
}

// Get status color class
function getStatusColor(status) {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
