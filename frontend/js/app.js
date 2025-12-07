// Main App Controller - Single Page Application Logic
// API_BASE is loaded from config.js
let currentPage = 'home';

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupMobileMenu();
  updateCartBadge();
  
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      loadPage(e.state.page, e.state.id);
    }
  });
  
  // Handle hash navigation
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
});

// Initialize the application
function initializeApp() {
  const hash = window.location.hash;
  if (hash) {
    handleHashChange();
  } else {
    loadHomePage();
  }
}

// Handle hash change for navigation
function handleHashChange() {
  const hash = window.location.hash.substring(1);
  
  if (hash.startsWith('product/')) {
    const productId = hash.split('/')[1];
    loadProductDetail(productId);
  } else if (hash === 'cart') {
    viewCart();
  } else if (hash === 'checkout') {
    loadCheckoutPage();
  } else if (hash === 'products') {
    loadProductsPage();
  } else if (hash === 'about') {
    loadAboutPage();
  } else if (hash === 'contact') {
    loadContactPage();
  } else {
    loadHomePage();
  }
}

// Setup mobile menu toggle
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking on a link
    const menuLinks = mobileMenu.querySelectorAll('a, button');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// Load Home Page
function loadHomePage() {
  currentPage = 'home';
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <!-- Hero Section with Responsive Background Image -->
    <section id="home" class="relative text-white py-16 md:py-24 lg:py-32 overflow-hidden">
      <!-- Background Image (visible on all devices) -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&h=1080&fit=crop" 
             alt="Krishna Enterprises Trophy Background" 
             class="w-full h-full object-cover"
             onerror="this.onerror=null; this.src='https://png.pngtree.com/background/20220726/original/pngtree-awards-realistic-composition-with-trophies-for-winner-picture-image_1797925.jpg';">
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70"></div>
        <!-- Dot Pattern Overlay -->
        <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(251, 191, 36, 0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-4 md:space-y-6">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Premium <span class="text-yellow-400">Trophies</span> & Awards
            </h1>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200">
              Celebrate Excellence with Krishna Enterprises - Your Trusted Partner for Custom Recognition Products in Jaipur
            </p>
            <div class="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <a href="#products" class="gold-gradient text-gray-900 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center">
                <i class="fas fa-trophy mr-2"></i>Browse Products
              </a>
              <a href="#contact" class="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg transition transform hover:scale-105 flex items-center justify-center">
                <i class="fas fa-phone mr-2"></i>Contact Us
              </a>
            </div>
          </div>

          <!-- Right Content - Featured Trophy Image -->
          <div class="relative mt-8 md:mt-0">
            <div class="relative rounded-lg overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop" 
                   alt="Krishna Enterprises - Premium Golden Trophy Awards Collection" 
                   class="w-full h-64 md:h-96 object-cover transform hover:scale-110 transition duration-500"
                   onerror="this.onerror=null; this.src='https://png.pngtree.com/background/20220726/original/pngtree-awards-realistic-composition-with-trophies-for-winner-picture-image_1797925.jpg';">
              <!-- Image Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <!-- Premium Quality Badge -->
              <div class="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg px-3 py-2 md:px-4 md:py-2 shadow-lg">
                <p class="text-xs md:text-sm font-bold flex items-center">
                  <i class="fas fa-award mr-2"></i>Premium Quality
                </p>
              </div>
              
              <!-- Experience Badge -->
              <div class="absolute bottom-4 right-4 bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 rounded-lg p-3 md:p-6 shadow-xl">
                <p class="text-2xl md:text-3xl font-bold">10+</p>
                <p class="text-xs md:text-sm font-semibold">Years Experience</p>
              </div>
            </div>

            <!-- Floating Elements (Desktop Only) -->
            <div class="hidden lg:block absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div class="hidden lg:block absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-500 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>

      <!-- Animated Trophy Icons (Background Decoration) -->
      <div class="absolute top-10 left-10 opacity-10 animate-pulse hidden lg:block">
        <i class="fas fa-trophy text-yellow-400 text-6xl"></i>
      </div>
      <div class="absolute bottom-20 right-20 opacity-10 animate-pulse hidden lg:block" style="animation-delay: 1s;">
        <i class="fas fa-award text-yellow-400 text-5xl"></i>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Us?</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-gem text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Premium Quality</h3>
            <p class="text-gray-600">Finest materials and craftsmanship</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-paint-brush text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Custom Designs</h3>
            <p class="text-gray-600">Personalized to your requirements</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-shipping-fast text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p class="text-gray-600">Quick turnaround times</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-handshake text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Trusted Service</h3>
            <p class="text-gray-600">Years of excellence in Jaipur</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Product Categories</h2>
          <p class="text-xl text-gray-600 mb-6">Browse our collection by category</p>
          <div class="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>
        
        <div id="home-categories-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-4xl text-yellow-500"></i>
            <p class="text-gray-600 mt-4">Loading categories...</p>
          </div>
        </div>

        <div class="text-center">
          <a href="#products" class="inline-block gold-gradient text-gray-900 font-bold px-8 py-4 rounded-lg hover:shadow-xl transition transform hover:scale-105">
            <i class="fas fa-arrow-right mr-2"></i>View All Products
          </a>
        </div>
      </div>
    </section>

    <!-- Customer Reviews Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p class="text-xl text-gray-600 mb-6">Share your experience with us</p>
          <div class="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Review Form -->
          <div class="bg-gray-50 rounded-lg shadow-lg p-8 mb-12">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-star text-yellow-500 mr-3"></i>
              Write a Review
            </h3>
            
            <form id="review-form" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Your Name *</label>
                  <input type="text" 
                         id="review-name" 
                         required
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                         placeholder="Enter your name">
                </div>
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Email (Optional)</label>
                  <input type="email" 
                         id="review-email"
                         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                         placeholder="your@email.com">
                </div>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">Rating *</label>
                <div class="flex items-center space-x-2">
                  <div id="star-rating" class="flex space-x-1">
                    <i class="fas fa-star text-3xl text-gray-300 cursor-pointer hover:text-yellow-400 transition" data-rating="1"></i>
                    <i class="fas fa-star text-3xl text-gray-300 cursor-pointer hover:text-yellow-400 transition" data-rating="2"></i>
                    <i class="fas fa-star text-3xl text-gray-300 cursor-pointer hover:text-yellow-400 transition" data-rating="3"></i>
                    <i class="fas fa-star text-3xl text-gray-300 cursor-pointer hover:text-yellow-400 transition" data-rating="4"></i>
                    <i class="fas fa-star text-3xl text-gray-300 cursor-pointer hover:text-yellow-400 transition" data-rating="5"></i>
                  </div>
                  <span id="rating-text" class="text-gray-600 font-semibold ml-4">Select rating</span>
                </div>
                <input type="hidden" id="review-rating" required>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">Your Review *</label>
                <textarea id="review-message" 
                          required
                          rows="5"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Tell us about your experience with Krishna Enterprises..."></textarea>
              </div>

              <div id="review-success" class="hidden bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-check-circle mr-2 text-xl"></i>
                <span>Thank you for your review! It will be visible after approval.</span>
              </div>

              <div id="review-error" class="hidden bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <i class="fas fa-exclamation-circle mr-2 text-xl"></i>
                <span id="review-error-message">Something went wrong. Please try again.</span>
              </div>

              <button type="submit" 
                      class="w-full gold-gradient text-gray-900 font-bold py-4 rounded-lg hover:shadow-xl transition transform hover:scale-105">
                <i class="fas fa-paper-plane mr-2"></i>Submit Review
              </button>
            </form>
          </div>

          <!-- Recent Reviews Display -->
          <div id="reviews-list" class="space-y-6">
            <!-- Reviews will be loaded here -->
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Load categories
  loadHomeCategories();
  
  // Setup review form
  setupReviewForm();
  
  // Load reviews
  loadReviews();
  
  window.scrollTo(0, 0);
}

// Load categories for home page
async function loadHomeCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const result = await response.json();
    const categories = result.data || result.categories || result; // Handle various response formats
    
    const grid = document.getElementById('home-categories-grid');
    if (!grid) return;
    
    if (!categories || categories.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
          <p class="text-xl text-gray-500">No categories available at the moment</p>
        </div>
      `;
      return;
    }
    
    grid.innerHTML = categories.map(category => `
      <a href="#products?category=${encodeURIComponent(category.slug || category.name)}" 
         class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group cursor-pointer block">
        <div class="p-8 text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300">
            <i class="fas ${category.icon || 'fa-folder'} text-white text-3xl"></i>
          </div>
          <h3 class="font-bold text-xl mb-2 text-gray-900">${category.name}</h3>
          <p class="text-gray-600 text-sm mb-4">${category.description || ''}</p>
          <span class="inline-flex items-center text-yellow-600 font-semibold group-hover:text-yellow-700">
            Browse <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition"></i>
          </span>
        </div>
      </a>
    `).join('');
  } catch (error) {
    console.error('Error loading categories:', error);
    const grid = document.getElementById('home-categories-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
          <p class="text-xl text-gray-500">Error loading products</p>
        </div>
      `;
    }
  }
}

// Load dedicated Products Page
function loadProductsPage() {
  currentPage = 'products';
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <!-- Products Page -->
    <section class="py-16 bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p class="text-xl text-gray-600">Discover our premium collection of trophies and awards</p>
        </div>
        
        <!-- Search and Filter -->
        <div class="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <div class="relative w-full md:w-96">
            <input type="text" 
                   id="search-input" 
                   placeholder="Search products..." 
                   class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <i class="fas fa-search absolute left-3 top-4 text-gray-400"></i>
          </div>
          <select id="category-filter" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="all">All Categories</option>
            <option value="Sports Trophies">Sports Trophies</option>
            <option value="Corporate Awards">Corporate Awards</option>
            <option value="Custom Trophies">Custom Trophies</option>
            <option value="Medals">Medals</option>
            <option value="Plaques">Plaques</option>
            <option value="Crystal Awards">Crystal Awards</option>
            <option value="Others">Others</option>
          </select>
        </div>
        
        <!-- Loading Spinner -->
        <div id="products-loading" class="flex justify-center items-center py-12">
          <div class="spinner"></div>
        </div>
        
        <!-- Products Grid -->
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <!-- Products will be loaded here -->
        </div>
        
        <!-- No Products Message -->
        <div id="no-products" class="text-center py-12 hidden">
          <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <p class="text-xl text-gray-500">No products found</p>
        </div>
      </div>
    </section>
  `;
  
  window.scrollTo(0, 0);
  
  // Load products
  loadProducts();
  
  // Setup search and filter
  setupProductFilters();
}

// Load dedicated About Page
function loadAboutPage() {
  currentPage = 'about';
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <!-- About Page -->
    <section class="py-16 bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <div class="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <!-- Company Introduction -->
        <div class="max-w-5xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12">
            <div class="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Krishna Enterprises</h2>
                <p class="text-lg text-gray-700 mb-4">
                  Your premier destination for high-quality trophies, awards, and recognition products in Jaipur, Rajasthan.
                </p>
                <p class="text-gray-600">
                  Under the leadership of <strong class="text-yellow-600">Yogesh Sharma</strong>, we have been serving schools, 
                  colleges, sports clubs, corporate houses, and individuals with excellence and dedication for over a decade.
                </p>
              </div>
              <div class="relative">
                <div class="w-full h-64 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-trophy text-white text-9xl opacity-80"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Our Story -->
          <div class="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-book-open text-yellow-500 mr-3"></i>
              Our Story
            </h2>
            <div class="space-y-4 text-gray-700">
              <p class="text-lg leading-relaxed">
                Founded with a vision to celebrate excellence and achievement, Krishna Enterprises has grown from a small 
                local shop to become one of Jaipur's most trusted names in the trophy and awards industry.
              </p>
              <p class="leading-relaxed">
                What started as a passion for craftsmanship has evolved into a commitment to help organizations and 
                individuals recognize and reward excellence. Over the years, we have had the privilege of creating 
                memorable recognition products for thousands of satisfied customers across Rajasthan.
              </p>
              <p class="leading-relaxed">
                Our journey has been marked by continuous improvement, innovation, and an unwavering commitment to 
                quality. We take pride in being part of countless success stories, celebrations, and memorable moments 
                through our products.
              </p>
            </div>
          </div>

          <!-- What We Offer -->
          <div class="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-award text-yellow-500 mr-3"></i>
              What We Offer
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-medal text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Sports Trophies</h3>
                  <p class="text-gray-600">Championship trophies, medals, and awards for all sports events, tournaments, and competitions.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-briefcase text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Corporate Awards</h3>
                  <p class="text-gray-600">Professional recognition awards for employee excellence, performance, and corporate events.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-trophy text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Custom Trophies</h3>
                  <p class="text-gray-600">Personalized and custom-designed trophies tailored to your specific requirements and branding.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-gem text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Crystal & Premium Awards</h3>
                  <p class="text-gray-600">Elegant crystal awards and premium recognition products for prestigious occasions.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-certificate text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Plaques & Mementos</h3>
                  <p class="text-gray-600">Decorative plaques and mementos for special recognition and commemorative purposes.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-palette text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Customization Services</h3>
                  <p class="text-gray-600">Engraving, printing, and personalization services to make each award unique and special.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Our Values -->
          <div class="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-heart text-yellow-500 mr-3"></i>
              Our Values
            </h2>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center p-6 bg-gray-50 rounded-lg">
                <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-star text-white text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">Quality Excellence</h3>
                <p class="text-gray-600">We never compromise on quality. Every product is crafted with precision and care.</p>
              </div>
              <div class="text-center p-6 bg-gray-50 rounded-lg">
                <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-users text-white text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">Customer First</h3>
                <p class="text-gray-600">Your satisfaction is our priority. We go the extra mile to exceed expectations.</p>
              </div>
              <div class="text-center p-6 bg-gray-50 rounded-lg">
                <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-handshake text-white text-2xl"></i>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">Trust & Integrity</h3>
                <p class="text-gray-600">We build lasting relationships through honest service and reliable delivery.</p>
              </div>
            </div>
          </div>

          <!-- Why Choose Us -->
          <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-8 md:p-12 text-white mb-12">
            <h2 class="text-3xl font-bold mb-6">Why Choose Krishna Enterprises?</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-start space-x-3">
                <i class="fas fa-check-circle text-2xl flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-1">10+ Years of Experience</h3>
                  <p class="text-yellow-50">Decade-long expertise in crafting premium trophies and awards.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-check-circle text-2xl flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-1">Wide Product Range</h3>
                  <p class="text-yellow-50">Extensive collection catering to all types of recognition needs.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-check-circle text-2xl flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-1">Custom Design Services</h3>
                  <p class="text-yellow-50">Personalized solutions tailored to your specific requirements.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-check-circle text-2xl flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-1">Competitive Pricing</h3>
                  <p class="text-yellow-50">Best quality products at fair and transparent prices.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-check-circle text-2xl flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-1">Fast Delivery</h3>
                  <p class="text-yellow-50">Quick turnaround times without compromising quality.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-check-circle text-2xl flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-1">Local Presence</h3>
                  <p class="text-yellow-50">Proudly serving Jaipur and Rajasthan with dedicated local service.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="text-center bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to Celebrate Excellence?</h2>
            <p class="text-lg text-gray-600 mb-6">
              Let us help you recognize and reward achievements with our premium trophies and awards.
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
              <a href="#products" class="gold-gradient text-gray-900 font-semibold px-8 py-4 rounded-lg hover:shadow-xl transition transform hover:scale-105 inline-flex items-center">
                <i class="fas fa-shopping-bag mr-2"></i>Browse Products
              </a>
              <a href="#contact" class="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition transform hover:scale-105 inline-flex items-center">
                <i class="fas fa-phone mr-2"></i>Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  window.scrollTo(0, 0);
}

// Load dedicated Contact Page
function loadContactPage() {
  currentPage = 'contact';
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <!-- Contact Page -->
    <section class="py-16 bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p class="text-xl text-gray-600">We'd love to hear from you. Get in touch with us today!</p>
          <div class="w-24 h-1 bg-yellow-400 mx-auto mt-4"></div>
        </div>

        <div class="max-w-6xl mx-auto">
          <!-- Contact Cards -->
          <div class="grid md:grid-cols-3 gap-6 mb-12">
            <!-- Phone Card -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-phone text-white text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p class="text-gray-600 mb-3">Available Mon-Sat, 10 AM - 7 PM</p>
              <a href="tel:+919782070381" class="text-yellow-600 hover:text-yellow-700 font-semibold text-lg block mb-2">
                +91 9782070381
              </a>
              <a href="tel:+917014881124" class="text-yellow-600 hover:text-yellow-700 font-semibold text-lg block">
                +91 7014881124
              </a>
            </div>

            <!-- WhatsApp Card -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fab fa-whatsapp text-white text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p class="text-gray-600 mb-3">Quick Response & Support</p>
              <a href="https://wa.me/919782070381?text=Hello%20Krishna%20Enterprises%2C%20I%20would%20like%20to%20inquire%20about" 
                 target="_blank"
                 class="text-green-600 hover:text-green-700 font-semibold text-lg">
                Chat with us
              </a>
            </div>

            <!-- Email Card -->
            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-envelope text-white text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p class="text-gray-600 mb-3">Send us your queries</p>
              <a href="mailto:sales@krishnaenterprises.info" class="text-blue-600 hover:text-blue-700 font-semibold">
                sales@krishnaenterprises.info
              </a>
            </div>
          </div>

          <!-- Main Contact Section -->
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <!-- Contact Information -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <i class="fas fa-info-circle text-yellow-500 mr-3"></i>
                Contact Information
              </h2>
              
              <!-- Address -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-map-marker-alt text-yellow-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-2">Our Address</h3>
                    <p class="text-gray-700 leading-relaxed">
                      <strong>Krishna Enterprises</strong><br>
                      A-90, Shri Govind Nagar 1st Extension,<br>
                      Niwaru Road, Jhotwara,<br>
                      Jaipur, Rajasthan 302013<br>
                      India
                    </p>
                  </div>
                </div>
              </div>

              <!-- Phone -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-phone text-yellow-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-2">Phone Numbers</h3>
                    <a href="tel:+919782070381" class="text-gray-700 hover:text-yellow-600 text-lg block mb-1">
                      +91 9782070381
                    </a>
                    <a href="tel:+917014881124" class="text-gray-700 hover:text-yellow-600 text-lg block">
                      +91 7014881124
                    </a>
                    <p class="text-sm text-gray-500 mt-2">Mon-Sat: 10:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>

              <!-- WhatsApp -->
              <div class="mb-6 pb-6 border-b border-gray-200">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fab fa-whatsapp text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-2">WhatsApp</h3>
                    <a href="https://wa.me/919782070381" target="_blank" class="text-gray-700 hover:text-green-600 text-lg">
                      +91 9782070381
                    </a>
                    <p class="text-sm text-gray-500 mt-1">Quick response & support</p>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-6">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-envelope text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-2">Email Address</h3>
                    <a href="mailto:sales@krishnaenterprises.info" class="text-gray-700 hover:text-blue-600 break-all">
                      sales@krishnaenterprises.info
                    </a>
                    <p class="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <!-- Owner Information -->
              <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 mt-6">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <i class="fas fa-user-tie text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900">Yogesh Sharma</h3>
                    <p class="text-sm text-gray-600">Owner & Founder</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Contact CTA -->
            <div class="space-y-6">
              <!-- WhatsApp CTA -->
              <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-8 text-white">
                <div class="text-center">
                  <i class="fab fa-whatsapp text-6xl mb-4 opacity-90"></i>
                  <h3 class="text-2xl font-bold mb-3">Message Us on WhatsApp</h3>
                  <p class="mb-6 text-green-50">
                    Get instant responses to your queries. We're just a message away!
                  </p>
                  <a href="https://wa.me/919782070381?text=Hello%20Krishna%20Enterprises%2C%20I%20would%20like%20to%20inquire%20about" 
                     target="_blank"
                     class="inline-block bg-white text-green-600 font-bold px-8 py-4 rounded-lg hover:bg-green-50 transition transform hover:scale-105">
                    <i class="fab fa-whatsapp mr-2"></i>Start Chat Now
                  </a>
                </div>
              </div>

              <!-- Call CTA -->
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
                <div class="text-center">
                  <i class="fas fa-phone text-6xl mb-4 opacity-90"></i>
                  <h3 class="text-2xl font-bold mb-3">Call Us Directly</h3>
                  <p class="mb-6 text-blue-50">
                    Speak with our team for personalized assistance and quotes.
                  </p>
                  <div class="space-y-3">
                    <a href="tel:+919782070381" 
                       class="block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition transform hover:scale-105">
                      <i class="fas fa-phone mr-2"></i>Call +91 9782070381
                    </a>
                    <a href="tel:+917014881124" 
                       class="block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition transform hover:scale-105">
                      <i class="fas fa-phone mr-2"></i>Call +91 7014881124
                    </a>
                  </div>
                </div>
              </div>

              <!-- Visit Store -->
              <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-8 text-white">
                <div class="text-center">
                  <i class="fas fa-store text-6xl mb-4 opacity-90"></i>
                  <h3 class="text-2xl font-bold mb-3">Visit Our Store</h3>
                  <p class="mb-4 text-yellow-50">
                    See our products in person at our Jaipur showroom.
                  </p>
                  <div class="text-sm text-yellow-50 mb-4">
                    <p class="font-semibold">Business Hours:</p>
                    <p>Monday - Saturday</p>
                    <p>10:00 AM - 7:00 PM</p>
                    <p class="mt-2 text-xs">(Closed on Sundays)</p>
                  </div>
                  <a href="https://maps.google.com/?q=A-90,Shri+Govind+Nagar+1st+Extension,Niwaru+Road,Jhotwara,Jaipur,Rajasthan+302013" 
                     target="_blank"
                     class="inline-block bg-white text-yellow-600 font-bold px-8 py-3 rounded-lg hover:bg-yellow-50 transition transform hover:scale-105">
                    <i class="fas fa-map-marked-alt mr-2"></i>Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Service Areas -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
              <i class="fas fa-map text-yellow-500 mr-3"></i>
              We Serve Across Rajasthan
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Jaipur</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Ajmer</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Jodhpur</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Udaipur</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Kota</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Bikaner</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">Alwar</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <i class="fas fa-map-marker-alt text-yellow-500 text-2xl mb-2"></i>
                <p class="font-semibold text-gray-900">& More</p>
              </div>
            </div>
          </div>

          <!-- FAQ Section -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
              <i class="fas fa-question-circle text-yellow-500 mr-3"></i>
              Frequently Asked Questions
            </h2>
            <div class="space-y-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-bold text-gray-900 mb-2">📦 Do you offer delivery services?</h3>
                <p class="text-gray-600">Yes, we provide delivery across Jaipur and Rajasthan. Contact us for delivery charges and timelines.</p>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-bold text-gray-900 mb-2">⏱️ How long does customization take?</h3>
                <p class="text-gray-600">Customization typically takes 3-7 days depending on the complexity and quantity. Rush orders may be accommodated.</p>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-bold text-gray-900 mb-2">💰 Do you offer bulk discounts?</h3>
                <p class="text-gray-600">Yes, we offer attractive discounts on bulk orders. Please contact us with your requirements for a quote.</p>
              </div>
              <div class="pb-4">
                <h3 class="font-bold text-gray-900 mb-2">🎨 Can I see samples before ordering?</h3>
                <p class="text-gray-600">Absolutely! Visit our showroom in Jaipur to see our products, or we can share photos via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  window.scrollTo(0, 0);
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

// Show loading spinner
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="flex justify-center items-center py-12"><div class="spinner"></div></div>';
  }
}

// Format currency
function formatCurrency(amount) {
  return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
}

// Setup Review Form
function setupReviewForm() {
  let selectedRating = 0;
  
  // Star rating interaction
  const stars = document.querySelectorAll('#star-rating i');
  const ratingInput = document.getElementById('review-rating');
  const ratingText = document.getElementById('rating-text');
  
  if (!stars.length) return;
  
  stars.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-rating'));
      ratingInput.value = selectedRating;
      updateStars(selectedRating);
      
      const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      ratingText.textContent = ratingLabels[selectedRating - 1];
    });
    
    star.addEventListener('mouseenter', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      updateStars(rating);
    });
  });
  
  const starRatingDiv = document.getElementById('star-rating');
  if (starRatingDiv) {
    starRatingDiv.addEventListener('mouseleave', function() {
      updateStars(selectedRating);
    });
  }
  
  function updateStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('text-gray-300');
        star.classList.add('text-yellow-400');
      } else {
        star.classList.remove('text-yellow-400');
        star.classList.add('text-gray-300');
      }
    });
  }
  
  // Handle review form submission
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('review-name').value.trim();
      const email = document.getElementById('review-email').value.trim();
      const rating = ratingInput.value;
      const message = document.getElementById('review-message').value.trim();
      
      if (!rating) {
        showReviewError('Please select a rating');
        return;
      }
      
      const submitButton = reviewForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
      
      try {
        const response = await fetch(`${API_BASE}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ name, email, rating: parseInt(rating), message })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showReviewSuccess();
          reviewForm.reset();
          selectedRating = 0;
          updateStars(0);
          ratingText.textContent = 'Select rating';
          ratingInput.value = '';
          
          // Reload reviews
          setTimeout(() => loadReviews(), 1000);
        } else {
          showReviewError(result.message || 'Failed to submit review');
        }
      } catch (error) {
        console.error('Review submission error:', error);
        showReviewError('Network error. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Review';
      }
    });
  }
}

function showReviewSuccess() {
  const successDiv = document.getElementById('review-success');
  const errorDiv = document.getElementById('review-error');
  if (errorDiv) errorDiv.classList.add('hidden');
  if (successDiv) {
    successDiv.classList.remove('hidden');
    setTimeout(() => successDiv.classList.add('hidden'), 5000);
  }
}

function showReviewError(message) {
  const errorDiv = document.getElementById('review-error');
  const errorMessage = document.getElementById('review-error-message');
  const successDiv = document.getElementById('review-success');
  if (successDiv) successDiv.classList.add('hidden');
  if (errorDiv && errorMessage) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 5000);
  }
}

// Load Reviews
async function loadReviews() {
  try {
    const response = await fetch(`${API_BASE}/reviews`);
    const result = await response.json();
    const reviews = result.data || result.reviews || [];
    
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
      reviewsList.innerHTML = `
        <div class="text-center py-12 bg-gray-50 rounded-lg">
          <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
          <p class="text-xl text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      `;
      return;
    }
    
    reviewsList.innerHTML = `
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900">Recent Reviews (${reviews.length})</h3>
      </div>
      ${reviews.map(review => `
        <div class="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">${escapeHtml(review.name)}</h4>
                <div class="flex items-center space-x-2">
                  <div class="flex">
                    ${Array.from({length: 5}, (_, i) => `
                      <i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} text-sm"></i>
                    `).join('')}
                  </div>
                  <span class="text-sm text-gray-500">
                    ${new Date(review.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">${escapeHtml(review.message)}</p>
        </div>
      `).join('')}
    `;
  } catch (error) {
    console.error('Error loading reviews:', error);
    const reviewsList = document.getElementById('reviews-list');
    if (reviewsList) {
      reviewsList.innerHTML = `
        <div class="text-center py-12 bg-red-50 rounded-lg">
          <i class="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
          <p class="text-gray-600">Error loading reviews</p>
        </div>
      `;
    }
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
