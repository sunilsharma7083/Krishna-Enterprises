// Admin Orders Management

let allOrders = [];

// Load orders page
async function loadOrders() {
  updateSidebarActive('Orders');
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
          <p class="text-gray-600 mt-2">Manage customer orders</p>
        </div>
        <button onclick="exportOrdersToCSV()" class="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition">
          <i class="fas fa-file-csv mr-2"></i>Export to CSV
        </button>
      </div>
    </div>
    
    <!-- Filter -->
    <div class="mb-6">
      <select id="orders-filter" onchange="filterOrders()" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
        <option value="all">All Orders</option>
        <option value="New">New Orders</option>
        <option value="Processing">Processing</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
    
    <!-- Orders List -->
    <div id="orders-list" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
    </div>
    
    <!-- Order Details Modal -->
    <div id="order-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Order Details</h2>
            <button onclick="closeOrderModal()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <div id="order-details-content">
            <!-- Order details will be loaded here -->
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Load orders list
  await loadOrdersList();
}

// Load orders list
async function loadOrdersList(status = 'all') {
  const listContainer = document.getElementById('orders-list');
  
  try {
    const url = status !== 'all' ? `${API_BASE}/orders?status=${status}` : `${API_BASE}/orders`;
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      allOrders = result.data;
      
      if (allOrders.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-12 text-gray-500">
            <i class="fas fa-shopping-cart text-6xl mb-4"></i>
            <p class="text-xl">No orders found</p>
          </div>
        `;
      } else {
        listContainer.innerHTML = `
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Order #</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Email</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Phone</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${allOrders.map(order => `
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 font-semibold text-gray-900">${order.orderNumber}</td>
                    <td class="py-3 px-4 text-gray-700">${order.customerName}</td>
                    <td class="py-3 px-4 text-gray-600">
                      ${order.email ? `<a href="mailto:${order.email}" class="hover:text-yellow-600">${order.email}</a>` : '<span class="text-gray-400 text-xs">N/A</span>'}
                    </td>
                    <td class="py-3 px-4 text-gray-600">
                      <a href="tel:${order.phone}" class="hover:text-yellow-600">${order.phone}</a>
                    </td>
                    <td class="py-3 px-4 text-gray-600 text-sm">${formatDate(order.orderDate)}</td>
                    <td class="py-3 px-4 font-semibold text-gray-900">${formatCurrency(order.totalAmount)}</td>
                    <td class="py-3 px-4">
                      <select onchange="updateOrderStatus('${order._id}', this.value)" 
                              class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} border-0">
                        <option value="New" ${order.status === 'New' ? 'selected' : ''}>New</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                    </td>
                    <td class="py-3 px-4">
                      <button onclick="viewOrderDetails('${order._id}')" class="text-blue-600 hover:text-blue-800 mr-3" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <a href="https://wa.me/${order.phone}?text=${encodeURIComponent('Hello ' + order.customerName + ', regarding your order ' + order.orderNumber)}" 
                         target="_blank" 
                         class="text-green-600 hover:text-green-800 mr-3" 
                         title="WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                      </a>
                      <button onclick="deleteOrder('${order._id}')" class="text-red-600 hover:text-red-800" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    listContainer.innerHTML = `
      <div class="text-center py-12 text-red-500">
        <i class="fas fa-exclamation-triangle text-4xl mb-3"></i>
        <p>Failed to load orders</p>
      </div>
    `;
  }
}

// Filter orders
function filterOrders() {
  const filter = document.getElementById('orders-filter').value;
  loadOrdersList(filter);
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Order status updated successfully', 'success');
      // Update the order in allOrders array
      const orderIndex = allOrders.findIndex(o => o._id === orderId);
      if (orderIndex !== -1) {
        allOrders[orderIndex].status = newStatus;
      }
    } else {
      showToast(result.message || 'Failed to update order status', 'error');
      // Reload orders to revert the dropdown
      await loadOrdersList();
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    showToast('Failed to update order status', 'error');
    await loadOrdersList();
  }
}

// View order details
async function viewOrderDetails(orderId) {
  const order = allOrders.find(o => o._id === orderId);
  if (!order) return;
  
  const detailsContainer = document.getElementById('order-details-content');
  
  detailsContainer.innerHTML = `
    <div class="space-y-6">
      <!-- Order Header -->
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">Order #${order.orderNumber}</h3>
          <p class="text-gray-600">${formatDate(order.orderDate)}</p>
        </div>
        <span class="px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}">
          ${order.status}
        </span>
      </div>
      
      <!-- Customer Information -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h4 class="font-semibold text-gray-900 mb-4">Customer Information</h4>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-600">Name</p>
            <p class="font-semibold text-gray-900">${order.customerName}</p>
          </div>
          <div>
            <p class="text-gray-600">Email</p>
            <p class="font-semibold text-gray-900">
              ${order.email ? `<a href="mailto:${order.email}" class="hover:text-yellow-600">${order.email}</a>` : '<span class="text-gray-400">Not provided</span>'}
            </p>
          </div>
          <div>
            <p class="text-gray-600">Phone</p>
            <p class="font-semibold text-gray-900">
              <a href="tel:${order.phone}" class="hover:text-yellow-600">${order.phone}</a>
            </p>
          </div>
          <div>
            <p class="text-gray-600">&nbsp;</p>
            <p class="font-semibold text-gray-900">&nbsp;</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-gray-600">Delivery Address</p>
            <p class="font-semibold text-gray-900">
              ${order.address}<br>
              ${order.city}, ${order.state} - ${order.pincode}
            </p>
          </div>
          ${order.message ? `
            <div class="md:col-span-2">
              <p class="text-gray-600">Special Instructions</p>
              <p class="font-semibold text-gray-900">${order.message}</p>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Order Items -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-4">Order Items</h4>
        <div class="space-y-3">
          ${order.items.map(item => `
            <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <img src="${item.image || 'https://via.placeholder.com/100'}" 
                     alt="${item.title}" 
                     class="w-16 h-16 object-cover rounded">
                <div>
                  <p class="font-semibold text-gray-900">${item.title}</p>
                  <p class="text-sm text-gray-600">Qty: ${item.quantity} × ${formatCurrency(item.price)}</p>
                </div>
              </div>
              <p class="font-semibold text-gray-900">${formatCurrency(item.price * item.quantity)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Order Total -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center text-xl font-bold text-gray-900">
          <span>Total Amount</span>
          <span class="text-yellow-600">${formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex space-x-3">
        <a href="https://wa.me/${order.phone}?text=${encodeURIComponent('Hello ' + order.customerName + ', regarding your order ' + order.orderNumber + ' - Total: ₹' + order.totalAmount)}" 
           target="_blank"
           class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition text-center">
          <i class="fab fa-whatsapp mr-2"></i>Contact on WhatsApp
        </a>
        <button onclick="closeOrderModal()" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
          Close
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('order-modal').classList.remove('hidden');
}

// Close order modal
function closeOrderModal() {
  document.getElementById('order-modal').classList.add('hidden');
}

// Delete order
async function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Order deleted successfully', 'success');
      await loadOrdersList();
    } else {
      showToast(result.message || 'Failed to delete order', 'error');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    showToast('Failed to delete order', 'error');
  }
}

// Export orders to CSV
async function exportOrdersToCSV() {
  try {
    showToast('Generating CSV file...', 'info');
    
    const response = await fetch(`${API_BASE}/orders/export/csv`);
    
    if (response.ok) {
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'krishna-enterprises-orders.csv';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('CSV file downloaded successfully', 'success');
    } else {
      showToast('Failed to export orders', 'error');
    }
  } catch (error) {
    console.error('Error exporting orders:', error);
    showToast('Failed to export orders', 'error');
  }
}
