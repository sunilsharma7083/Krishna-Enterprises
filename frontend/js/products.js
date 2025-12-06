// Products Management

// Load all products with optional filters
async function loadProducts(search = null, category = null) {
  const loadingElement = document.getElementById('products-loading');
  const gridElement = document.getElementById('products-grid');
  const noProductsElement = document.getElementById('no-products');
  
  if (!gridElement) return;
  
  try {
    // Show loading
    if (loadingElement) loadingElement.classList.remove('hidden');
    if (gridElement) gridElement.innerHTML = '';
    if (noProductsElement) noProductsElement.classList.add('hidden');
    
    // Build query parameters
    let queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (category && category !== 'all') queryParams.push(`category=${encodeURIComponent(category)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    // Fetch products
    const response = await fetch(`${API_BASE}/products${queryString}`);
    const result = await response.json();
    
    // Hide loading
    if (loadingElement) loadingElement.classList.add('hidden');
    
    if (result.success && result.data.length > 0) {
      displayProducts(result.data);
    } else {
      if (noProductsElement) noProductsElement.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    if (loadingElement) loadingElement.classList.add('hidden');
    showToast('Failed to load products', 'error');
  }
}

// Display products in grid
function displayProducts(products) {
  const gridElement = document.getElementById('products-grid');
  if (!gridElement) return;
  
  gridElement.innerHTML = products.map(product => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer" onclick="loadProductDetail('${product._id}')">
      <div class="relative">
        <img src="${product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x400?text=Trophy'}" 
             alt="${product.title}" 
             class="w-full h-64 object-cover"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400?text=Trophy+Image';">
        ${product.featured ? '<span class="absolute top-2 right-2 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Featured</span>' : ''}
        ${!product.inStock ? '<span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>' : ''}
      </div>
      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">${product.title}</h3>
        <p class="text-sm text-gray-500 mb-3">${product.category}</p>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-yellow-600">${formatCurrency(product.price)}</span>
          <button onclick="event.stopPropagation(); addToCartQuick('${product._id}')" 
                  class="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-lg transition"
                  ${!product.inStock ? 'disabled' : ''}>
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Quick add to cart from product card
async function addToCartQuick(productId) {
  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    const result = await response.json();
    
    if (result.success) {
      addToCart(result.data, 1);
    } else {
      showToast('Failed to add product to cart', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add product to cart', 'error');
  }
}

// Load product detail page
async function loadProductDetail(productId) {
  currentPage = 'product-detail';
  window.location.hash = `product/${productId}`;
  const content = document.getElementById('app-content');
  
  content.innerHTML = '<div class="container mx-auto px-4 py-16"><div class="flex justify-center"><div class="spinner"></div></div></div>';
  
  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    const result = await response.json();
    
    if (!result.success || !result.data) {
      content.innerHTML = `
        <div class="container mx-auto px-4 py-16 text-center">
          <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button onclick="loadHomePage()" class="gold-gradient text-gray-900 font-semibold px-6 py-3 rounded-lg">
            Back to Home
          </button>
        </div>
      `;
      return;
    }
    
    const product = result.data;
    
    // Generate WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `Hello Krishna Enterprises, I want to order:\n\n` +
      `Product: ${product.title}\n` +
      `Category: ${product.category}\n` +
      `Price: ₹${product.price}\n\n` +
      `Please confirm availability and delivery details.`
    );
    
    content.innerHTML = `
      <div class="bg-gray-50 py-8">
        <div class="container mx-auto px-4">
          <button onclick="window.history.back()" class="text-gray-600 hover:text-gray-900 mb-6 flex items-center">
            <i class="fas fa-arrow-left mr-2"></i>Back
          </button>
          
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="grid md:grid-cols-2 gap-8">
              <!-- Product Images -->
              <div class="p-8">
                <div class="mb-4">
                  <img id="main-image" 
                       src="${product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600x600?text=Trophy'}" 
                       alt="${product.title}" 
                       class="w-full h-96 object-contain rounded-lg bg-gray-50"
                       onerror="this.onerror=null; this.src='https://via.placeholder.com/600x600?text=Trophy+Image';">
                </div>
                ${product.images && product.images.length > 1 ? `
                  <div class="grid grid-cols-4 gap-2">
                    ${product.images.map((img, index) => `
                      <img src="${img}" 
                           alt="${product.title}" 
                           onclick="document.getElementById('main-image').src='${img}'"
                           class="w-full h-20 object-cover rounded-lg cursor-pointer border-2 hover:border-yellow-400 transition"
                           onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100?text=Trophy';">
                    `).join('')}
                  </div>
                ` : ''}
              </div>
              
              <!-- Product Info -->
              <div class="p-8">
                <div class="mb-4">
                  <span class="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                    ${product.category}
                  </span>
                  ${product.featured ? '<span class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-2 ml-2">Featured</span>' : ''}
                  ${!product.inStock ? '<span class="inline-block bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full mb-2 ml-2">Out of Stock</span>' : ''}
                </div>
                
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${product.title}</h1>
                
                <div class="mb-6">
                  <span class="text-4xl font-bold text-yellow-600">${formatCurrency(product.price)}</span>
                </div>
                
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p class="text-gray-700 leading-relaxed">${product.description}</p>
                </div>
                
                ${product.inStock ? `
                  <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Quantity</label>
                    <div class="flex items-center space-x-4">
                      <button id="qty-minus" class="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
                        <i class="fas fa-minus"></i>
                      </button>
                      <input type="number" 
                             id="quantity-input" 
                             value="1" 
                             min="1" 
                             class="w-20 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg py-2">
                      <button id="qty-plus" class="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <button onclick="addToCartFromDetail('${product._id}')" 
                            class="w-full gold-gradient text-gray-900 font-semibold px-8 py-4 rounded-lg hover:shadow-xl transition text-lg">
                      <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                    </button>
                    <a href="https://wa.me/919782070381?text=${whatsappMessage}" 
                       target="_blank"
                       class="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg text-center">
                      <i class="fab fa-whatsapp mr-2"></i>Order via WhatsApp
                    </a>
                  </div>
                ` : `
                  <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p class="text-red-800 font-semibold">This product is currently out of stock.</p>
                  </div>
                  <a href="https://wa.me/919782070381?text=${whatsappMessage}" 
                     target="_blank"
                     class="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition text-lg text-center">
                    <i class="fab fa-whatsapp mr-2"></i>Check Availability
                  </a>
                `}
                
                <div class="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 class="font-semibold text-gray-900 mb-3">Why Choose Krishna Enterprises?</h3>
                  <ul class="space-y-2 text-sm text-gray-700">
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Premium Quality Materials</li>
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Custom Design Available</li>
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Fast Delivery in Jaipur</li>
                    <li><i class="fas fa-check text-green-500 mr-2"></i>Expert Craftsmanship</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup quantity controls
    if (product.inStock) {
      const qtyInput = document.getElementById('quantity-input');
      const qtyMinus = document.getElementById('qty-minus');
      const qtyPlus = document.getElementById('qty-plus');
      
      qtyMinus.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
          qtyInput.value = currentValue - 1;
        }
      });
      
      qtyPlus.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        qtyInput.value = currentValue + 1;
      });
    }
    
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error loading product:', error);
    content.innerHTML = `
      <div class="container mx-auto px-4 py-16 text-center">
        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Failed to Load Product</h1>
        <button onclick="loadHomePage()" class="gold-gradient text-gray-900 font-semibold px-6 py-3 rounded-lg">
          Back to Home
        </button>
      </div>
    `;
  }
}

// Add to cart from product detail page
async function addToCartFromDetail(productId) {
  const qtyInput = document.getElementById('quantity-input');
  const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
  
  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    const result = await response.json();
    
    if (result.success) {
      addToCart(result.data, quantity);
    } else {
      showToast('Failed to add product to cart', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add product to cart', 'error');
  }
}

// Setup product filters (search and category)
function setupProductFilters() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.trim();
        const category = categoryFilter ? categoryFilter.value : 'all';
        loadProducts(searchTerm || null, category !== 'all' ? category : null);
      }, 500);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      const searchTerm = searchInput ? searchInput.value.trim() : '';
      const category = e.target.value;
      loadProducts(searchTerm || null, category !== 'all' ? category : null);
    });
  }
}
