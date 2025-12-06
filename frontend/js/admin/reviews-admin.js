// Admin Reviews Management

function loadReviewsAdmin() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-900">Customer Reviews</h2>
      <p class="text-gray-600 mt-2">Manage and approve customer reviews</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-semibold">Total Reviews</p>
            <p id="total-reviews" class="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-comments text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-semibold">Pending Approval</p>
            <p id="pending-reviews" class="text-3xl font-bold text-yellow-600 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-semibold">Approved</p>
            <p id="approved-reviews" class="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900">All Reviews</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody id="reviews-table-body" class="bg-white divide-y divide-gray-200">
            <tr>
              <td colspan="6" class="px-6 py-12 text-center">
                <i class="fas fa-spinner fa-spin text-3xl text-gray-400 mb-2"></i>
                <p class="text-gray-500">Loading reviews...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  // Load reviews data
  fetchReviewsData();
  
  // Update sidebar
  updateSidebarActive('Reviews');
}

async function fetchReviewsData() {
  try {
    const response = await fetch(`${API_BASE}/reviews/all`, {
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      displayReviews(result.data);
      updateReviewStats(result.data);
    } else {
      showError('Failed to load reviews');
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    showError('Error loading reviews');
  }
}

function displayReviews(reviews) {
  const tbody = document.getElementById('reviews-table-body');
  
  if (!reviews || reviews.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center">
          <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">No reviews yet</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = reviews.map(review => `
    <tr>
      <td class="px-6 py-4">
        <div>
          <p class="font-semibold text-gray-900">${escapeHtml(review.name)}</p>
          ${review.email ? `<p class="text-sm text-gray-500">${escapeHtml(review.email)}</p>` : ''}
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center">
          ${Array.from({length: 5}, (_, i) => `
            <i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} text-sm"></i>
          `).join('')}
          <span class="ml-2 text-sm text-gray-600">(${review.rating})</span>
        </div>
      </td>
      <td class="px-6 py-4">
        <p class="text-sm text-gray-700 max-w-xs truncate">${escapeHtml(review.message)}</p>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <p class="text-sm text-gray-600">
          ${new Date(review.createdAt).toLocaleDateString('en-IN')}
        </p>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${review.isApproved 
          ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>'
          : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>'
        }
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right">
        ${!review.isApproved 
          ? `<button onclick="approveReview('${review._id}')" 
                      class="text-green-600 hover:text-green-900 mr-3" 
                      title="Approve">
               <i class="fas fa-check"></i>
             </button>`
          : ''
        }
        <button onclick="viewReview('${review._id}', ${JSON.stringify(review).replace(/"/g, '&quot;')})" 
                class="text-blue-600 hover:text-blue-900 mr-3" 
                title="View">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="deleteReview('${review._id}')" 
                class="text-red-600 hover:text-red-900" 
                title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function updateReviewStats(reviews) {
  const total = reviews.length;
  const pending = reviews.filter(r => !r.isApproved).length;
  const approved = reviews.filter(r => r.isApproved).length;
  
  document.getElementById('total-reviews').textContent = total;
  document.getElementById('pending-reviews').textContent = pending;
  document.getElementById('approved-reviews').textContent = approved;
}

async function approveReview(reviewId) {
  if (!confirm('Approve this review?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}/approve`, {
      method: 'PUT',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccess('Review approved successfully');
      fetchReviewsData(); // Reload
    } else {
      showError(result.message || 'Failed to approve review');
    }
  } catch (error) {
    console.error('Error approving review:', error);
    showError('Error approving review');
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
  
  try {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccess('Review deleted successfully');
      fetchReviewsData(); // Reload
    } else {
      showError(result.message || 'Failed to delete review');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    showError('Error deleting review');
  }
}

function viewReview(reviewId, review) {
  alert(`Review by ${review.name}\n\nRating: ${review.rating}/5\n\nMessage: ${review.message}\n\nEmail: ${review.email || 'Not provided'}\n\nDate: ${new Date(review.createdAt).toLocaleString('en-IN')}\n\nStatus: ${review.isApproved ? 'Approved' : 'Pending'}`);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showSuccess(message) {
  // Reuse existing toast or create simple alert
  alert('✅ ' + message);
}

function showError(message) {
  alert('❌ ' + message);
}
