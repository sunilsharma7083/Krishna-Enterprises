// Admin Products Management

let allProducts = [];
let editingProductId = null;

// Helper function to get full image URL
function getImageUrl(imagePath) {
  if (!imagePath) return 'https://via.placeholder.com/100';
  
  // If already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Always use Render backend for images (where they are stored)
  const backendUrl = 'https://krishna-enterprises-9oup.onrender.com';
  return `${backendUrl}${imagePath}`;
}

// Load products page
async function loadProducts() {
  updateSidebarActive('Products');
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-600 mt-2">Manage your trophy products</p>
        </div>
        <button onclick="showAddProductForm()" class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
          <i class="fas fa-plus mr-2"></i>Add New Product
        </button>
      </div>
    </div>
    
    <!-- Products List -->
    <div id="products-list" class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-center py-12">
        <div class="spinner"></div>
      </div>
    </div>
    
    <!-- Add/Edit Product Modal -->
    <div id="product-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900" id="modal-title">Add New Product</h2>
            <button onclick="closeProductModal()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <form id="product-form" class="space-y-6">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Product Title *</label>
              <input type="text" id="product-title" required
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                     placeholder="Enter product title">
            </div>
            
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Category *</label>
              <select id="product-category" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <option value="">Select category</option>
                <option value="Sports Trophies">Sports Trophies</option>
                <option value="Corporate Awards">Corporate Awards</option>
                <option value="Custom Trophies">Custom Trophies</option>
                <option value="Medals">Medals</option>
                <option value="Plaques">Plaques</option>
                <option value="Crystal Awards">Crystal Awards</option>
                <option value="Others">Others</option>
              </select>
            </div>
            
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
              <input type="number" id="product-price" required min="0" step="0.01"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                     placeholder="Enter price">
            </div>
            
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea id="product-description" required rows="4"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter product description"></textarea>
            </div>
            
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Product Images</label>
              <input type="file" id="product-images" accept="image/*" multiple
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <p class="text-sm text-gray-600 mt-2 bg-blue-50 p-3 rounded-lg">
                <i class="fas fa-info-circle text-blue-600"></i>
                <strong>Supported formats:</strong> JPEG, JPG, PNG, GIF, WEBP, BMP
                <br>
                <i class="fas fa-check-circle text-green-600"></i>
                <strong>Maximum:</strong> 5 images, 10MB per image
                <br>
                <i class="fas fa-image text-purple-600"></i>
                <strong>Tip:</strong> Images of any size will be accepted (variable size supported)
              </p>
              <div id="existing-images" class="mt-4 grid grid-cols-4 gap-2"></div>
            </div>
            
            <div class="flex items-center space-x-6">
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" id="product-featured" class="w-5 h-5 text-yellow-500 focus:ring-yellow-400 rounded">
                <span class="ml-2 text-gray-700 font-semibold">Featured Product</span>
              </label>
              
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" id="product-instock" checked class="w-5 h-5 text-yellow-500 focus:ring-yellow-400 rounded">
                <span class="ml-2 text-gray-700 font-semibold">In Stock</span>
              </label>
            </div>
            
            <div class="flex space-x-4">
              <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
                <i class="fas fa-save mr-2"></i>Save Product
              </button>
              <button type="button" onclick="closeProductModal()" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Load products list
  await loadProductsList();
  
  // Setup form submission
  document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
}

// Load products list
async function loadProductsList() {
  const listContainer = document.getElementById('products-list');
  
  try {
    const response = await fetch(`${API_BASE}/products`, {
      credentials: 'include'
    });
    const result = await response.json();
    
    if (result.success) {
      allProducts = result.data;
      
      if (allProducts.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-12 text-gray-500">
            <i class="fas fa-trophy text-6xl mb-4"></i>
            <p class="text-xl">No products yet</p>
            <button onclick="showAddProductForm()" class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
              <i class="fas fa-plus mr-2"></i>Add Your First Product
            </button>
          </div>
        `;
      } else {
        listContainer.innerHTML = `
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Image</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Title</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Price</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th class="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${allProducts.map(product => `
                  <tr class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <img src="${getImageUrl(product.images && product.images.length > 0 ? product.images[0] : null)}" 
                           alt="${product.title}" 
                           class="w-16 h-16 object-cover rounded">
                    </td>
                    <td class="py-3 px-4 font-semibold text-gray-900">${product.title}</td>
                    <td class="py-3 px-4 text-gray-600">${product.category}</td>
                    <td class="py-3 px-4 font-semibold text-gray-900">${formatCurrency(product.price)}</td>
                    <td class="py-3 px-4">
                      ${product.featured ? '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mr-1">Featured</span>' : ''}
                      <span class="px-2 py-1 ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs rounded-full">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <button onclick="editProduct('${product._id}')" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button onclick="deleteProduct('${product._id}')" class="text-red-600 hover:text-red-800">
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
    console.error('Error loading products:', error);
    listContainer.innerHTML = `
      <div class="text-center py-12 text-red-500">
        <i class="fas fa-exclamation-triangle text-4xl mb-3"></i>
        <p>Failed to load products</p>
      </div>
    `;
  }
}

// Show add product form
function showAddProductForm() {
  editingProductId = null;
  document.getElementById('modal-title').textContent = 'Add New Product';
  document.getElementById('product-form').reset();
  document.getElementById('existing-images').innerHTML = '';
  document.getElementById('product-modal').classList.remove('hidden');
}

// Edit product
async function editProduct(productId) {
  editingProductId = productId;
  const product = allProducts.find(p => p._id === productId);
  
  if (!product) return;
  
  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('product-title').value = product.title;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-featured').checked = product.featured;
  document.getElementById('product-instock').checked = product.inStock;
  
  // Show existing images
  const existingImagesContainer = document.getElementById('existing-images');
  if (product.images && product.images.length > 0) {
    existingImagesContainer.innerHTML = product.images.map((img, index) => `
      <div class="relative">
        <img src="${getImageUrl(img)}" alt="Product image" class="w-full h-24 object-cover rounded">
        <button type="button" onclick="removeExistingImage(${index})" 
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          <i class="fas fa-times"></i>
        </button>
        <input type="hidden" name="existingImages[]" value="${img}">
      </div>
    `).join('');
  }
  
  document.getElementById('product-modal').classList.remove('hidden');
}

// Remove existing image
function removeExistingImage(index) {
  const container = document.getElementById('existing-images');
  const images = container.querySelectorAll('div');
  if (images[index]) {
    images[index].remove();
  }
}

// Close product modal
function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  editingProductId = null;
}

// Handle product form submission
async function handleProductSubmit(e) {
  e.preventDefault();
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
  
  const formData = new FormData();
  formData.append('title', document.getElementById('product-title').value.trim());
  formData.append('category', document.getElementById('product-category').value);
  formData.append('price', document.getElementById('product-price').value);
  formData.append('description', document.getElementById('product-description').value.trim());
  formData.append('featured', document.getElementById('product-featured').checked);
  formData.append('inStock', document.getElementById('product-instock').checked);
  
  // Add new images with validation
  const imageFiles = document.getElementById('product-images').files;
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  const maxFiles = 5;
  
  console.log('📸 Validating', imageFiles.length, 'image(s)...');
  
  // Check file count
  if (imageFiles.length > maxFiles) {
    showToast(`Too many files! Maximum ${maxFiles} images allowed.`, 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    return;
  }
  
  // Check file sizes and types
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    console.log(`📁 File ${i + 1}: ${file.name} (${fileSizeMB} MB, ${file.type})`);
    
    // Check file size
    if (file.size > maxSize) {
      showToast(`File "${file.name}" is too large (${fileSizeMB} MB). Maximum size is 10MB.`, 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast(`File "${file.name}" is not an image file.`, 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      return;
    }
    
    console.log(`✅ File ${i + 1} validated successfully`);
    formData.append('images', file);
  }
  
  if (imageFiles.length > 0) {
    console.log(`✅ All ${imageFiles.length} file(s) validated and ready for upload`);
  }
  
  // Add existing images (for edit mode)
  if (editingProductId) {
    const existingImages = document.querySelectorAll('input[name="existingImages[]"]');
    existingImages.forEach(input => {
      formData.append('existingImages', input.value);
    });
  }
  
  try {
    console.log('📤 Uploading product with', imageFiles.length, 'images');
    
    const url = editingProductId ? `${API_BASE}/products/${editingProductId}` : `${API_BASE}/products`;
    const method = editingProductId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      body: formData,
      credentials: 'include'
    });
    
    console.log('📡 Response status:', response.status);
    
    const result = await response.json();
    console.log('📦 Response data:', result);
    
    if (result.success) {
      console.log('✅ Product saved successfully');
      showToast(result.message || 'Product saved successfully! Images will appear shortly.', 'success');
      closeProductModal();
      await loadProductsList();
    } else {
      console.error('❌ Save failed:', result.message);
      showToast(result.message || 'Failed to save product. Please check image format (JPEG, JPG, PNG, GIF, WEBP)', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  } catch (error) {
    console.error('❌ Error saving product:', error);
    showToast('Failed to save product. Please check console for details.', 'error');
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      showToast('Product deleted successfully', 'success');
      await loadProductsList();
    } else {
      showToast(result.message || 'Failed to delete product', 'error');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showToast('Failed to delete product', 'error');
  }
}
