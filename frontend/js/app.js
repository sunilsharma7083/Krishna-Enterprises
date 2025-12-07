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

// Global function to toggle mobile menu
function toggleMobileMenu() {
  console.log('🔄 Toggle mobile menu called');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('mobile-menu-btn');
  
  console.log('📱 Mobile Menu element:', mobileMenu);
  console.log('🔘 Menu Button element:', menuBtn);
  
  if (mobileMenu) {
    const isActive = mobileMenu.classList.contains('active');
    
    console.log('📊 Has active class:', isActive);
    
    if (isActive) {
      mobileMenu.classList.remove('active');
      console.log('✅ Menu closed - removed active class');
    } else {
      mobileMenu.classList.add('active');
      console.log('✅ Menu opened - added active class');
    }
    
    // Toggle icon
    if (menuBtn) {
      const icon = menuBtn.querySelector('i');
      if (icon) {
        if (isActive) {
          icon.className = 'fas fa-bars';
          console.log('🔄 Icon changed to hamburger');
        } else {
          icon.className = 'fas fa-times';
          console.log('🔄 Icon changed to X');
        }
      }
    }
  } else {
    console.error('❌ Mobile menu element not found!');
  }
}

// Close mobile menu
function closeMobileMenu() {
  console.log('🚪 Closing mobile menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBtn = document.getElementById('mobile-menu-btn');
  
  if (mobileMenu) {
    mobileMenu.classList.remove('active');
    console.log('✅ Menu closed - removed active class');
  }
  
  if (menuBtn) {
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-bars';
      console.log('🔄 Icon reset to hamburger');
    }
  }
}

// Setup mobile menu toggle
function setupMobileMenu() {
  console.log('🔧 Setting up mobile menu...');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  console.log('📱 Menu Button:', menuBtn);
  console.log('📱 Mobile Menu:', mobileMenu);
  
  if (menuBtn && mobileMenu) {
    // Direct event listener without cloning
    menuBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔘 Menu button clicked!');
      toggleMobileMenu();
    };
    
    // Also add touch event for mobile devices
    menuBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      console.log('👆 Menu button touched!');
      toggleMobileMenu();
    }, { passive: false });
    
    // Close menu when clicking on a link
    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
    console.log('📋 Found', menuLinks.length, 'menu links');
    
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        console.log('🔗 Link clicked:', link.textContent);
        // Let the hash navigation happen, then close menu
        setTimeout(() => {
          closeMobileMenu();
        }, 100);
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const menuBtnElement = document.getElementById('mobile-menu-btn');
      const isClickInsideMenu = mobileMenu.contains(e.target);
      const isClickOnButton = menuBtnElement && menuBtnElement.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
        console.log('🚪 Closing menu - clicked outside');
        closeMobileMenu();
      }
    });
    
    console.log('✅ Mobile menu setup complete');
  } else {
    console.error('❌ Mobile menu elements not found!');
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
              <img src="https://png.pngtree.com/background/20220726/original/pngtree-awards-realistic-composition-with-trophies-for-winner-picture-image_1797925.jpg" 
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

    <!-- Product Categories Section -->
    <section class="py-12 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 md:mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Product Categories</h2>
          <p class="text-lg md:text-xl text-gray-600 mb-4 md:mb-6">Browse our collection by category</p>
          <div class="w-20 md:w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>
        
        <div id="home-categories-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <div class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-4xl text-yellow-500"></i>
            <p class="text-gray-600 mt-4">Loading categories...</p>
          </div>
        </div>

        <!-- Featured Products -->
        <div class="mb-6 md:mb-8">
          <div class="text-center mb-4 md:mb-6">
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Featured Products</h3>
            <p class="text-sm md:text-base text-gray-600">Popular items from our collection</p>
          </div>
          <div id="home-featured-products" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div class="col-span-2 lg:col-span-4 text-center py-6">
              <i class="fas fa-spinner fa-spin text-2xl text-yellow-500"></i>
              <p class="text-gray-600 mt-2 text-xs md:text-sm">Loading products...</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-4 md:mt-6">
          <a href="#products" class="inline-block gold-gradient text-gray-900 font-semibold px-5 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded-lg hover:shadow-xl transition transform hover:scale-105">
            <i class="fas fa-arrow-right mr-1 md:mr-2 text-xs"></i>View All Products
          </a>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose Krishna Enterprises?</h2>
          <p class="text-xl text-gray-600 mb-6">Your trusted partner for premium trophies and awards</p>
          <div class="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-4 md:p-6 text-white">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">10+ Years of Experience</h3>
                  <p class="text-yellow-50 text-xs">Decade-long expertise in crafting premium trophies and awards.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Wide Product Range</h3>
                  <p class="text-yellow-50 text-xs">Extensive collection catering to all types of recognition needs.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Custom Design Services</h3>
                  <p class="text-yellow-50 text-xs">Personalized solutions tailored to your specific requirements.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Competitive Pricing</h3>
                  <p class="text-yellow-50 text-xs">Best quality products at fair and transparent prices.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Fast Delivery</h3>
                  <p class="text-yellow-50 text-xs">Quick turnaround times without compromising quality.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Local Presence</h3>
                  <p class="text-yellow-50 text-xs">Proudly serving Jaipur and Rajasthan with dedicated local service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Reviews Section -->
    <section class="py-8 md:py-12 bg-gradient-to-br from-yellow-50 via-white to-orange-50 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-yellow-200 rounded-full opacity-10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-60 h-60 md:w-96 md:h-96 bg-orange-200 rounded-full opacity-10 blur-3xl"></div>
      
      <div class="container mx-auto px-3 md:px-4 relative z-10">
        <div class="text-center mb-6 md:mb-8">
          <div class="inline-block mb-3">
            <div class="flex items-center justify-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-lg">
              <i class="fas fa-star text-xs md:text-sm"></i>
              <i class="fas fa-star text-xs md:text-sm"></i>
              <i class="fas fa-star text-xs md:text-sm"></i>
              <i class="fas fa-star text-xs md:text-sm"></i>
              <i class="fas fa-star text-xs md:text-sm"></i>
            </div>
          </div>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">Customer Reviews</h2>
          <p class="text-sm md:text-base lg:text-lg text-gray-600 mb-3 md:mb-4 px-4">Share your experience with us</p>
          <div class="w-16 md:w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
        </div>

        <div class="max-w-3xl mx-auto">
          <!-- Review Form -->
          <div class="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 border border-yellow-200 relative overflow-hidden">
            <!-- Decorative corner elements -->
            <div class="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 to-orange-400 opacity-5 md:opacity-10 rounded-bl-full"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-tr from-yellow-400 to-orange-400 opacity-5 md:opacity-10 rounded-tr-full"></div>
            
            <div class="relative z-10">
              <div class="text-center mb-4 md:mb-6">
                <div class="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg mb-3">
                  <i class="fas fa-pen-fancy text-white text-lg md:text-2xl"></i>
                </div>
                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Write a Review</h3>
                <p class="text-xs md:text-sm text-gray-600">Your feedback matters!</p>
              </div>
            
              <form id="review-form" class="space-y-3 md:space-y-4">
                <div class="grid md:grid-cols-2 gap-3 md:gap-4">
                  <div class="relative">
                    <label class="block text-gray-700 font-semibold mb-1.5 md:mb-2 flex items-center text-sm md:text-base">
                      <i class="fas fa-user text-yellow-500 mr-1.5 text-sm"></i>Your Name *
                    </label>
                    <div class="relative">
                      <input type="text" 
                             id="review-name" 
                             required
                             class="w-full px-3 py-2 md:px-4 md:py-3 pl-9 md:pl-11 border-2 border-yellow-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-sm md:text-base"
                             placeholder="Enter your name">
                      <i class="fas fa-user-circle absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-sm md:text-base"></i>
                    </div>
                  </div>
                  <div class="relative">
                    <label class="block text-gray-700 font-semibold mb-1.5 md:mb-2 flex items-center text-sm md:text-base">
                      <i class="fas fa-envelope text-yellow-500 mr-1.5 text-sm"></i>Email (Optional)
                    </label>
                    <div class="relative">
                      <input type="email" 
                             id="review-email"
                             class="w-full px-3 py-2 md:px-4 md:py-3 pl-9 md:pl-11 border-2 border-yellow-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition text-sm md:text-base"
                             placeholder="your@email.com">
                      <i class="fas fa-envelope-open absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-sm md:text-base"></i>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 md:p-4 rounded-lg border border-yellow-200">
                  <label class="block text-gray-700 font-semibold mb-2 md:mb-3 flex items-center text-sm md:text-base">
                    <i class="fas fa-star text-yellow-500 mr-1.5 text-sm"></i>Rate Your Experience *
                  </label>
                  <div class="flex flex-col sm:flex-row items-center justify-center sm:space-x-3 space-y-2 sm:space-y-0">
                    <div id="star-rating" class="flex space-x-1.5 md:space-x-2">
                      <i class="fas fa-star text-3xl md:text-4xl text-gray-300 cursor-pointer hover:text-yellow-400 hover:scale-110 transition transform" data-rating="1"></i>
                      <i class="fas fa-star text-3xl md:text-4xl text-gray-300 cursor-pointer hover:text-yellow-400 hover:scale-110 transition transform" data-rating="2"></i>
                      <i class="fas fa-star text-3xl md:text-4xl text-gray-300 cursor-pointer hover:text-yellow-400 hover:scale-110 transition transform" data-rating="3"></i>
                      <i class="fas fa-star text-3xl md:text-4xl text-gray-300 cursor-pointer hover:text-yellow-400 hover:scale-110 transition transform" data-rating="4"></i>
                      <i class="fas fa-star text-3xl md:text-4xl text-gray-300 cursor-pointer hover:text-yellow-400 hover:scale-110 transition transform" data-rating="5"></i>
                    </div>
                    <span id="rating-text" class="text-gray-600 font-semibold text-xs md:text-sm bg-white px-3 py-1.5 rounded-full shadow-sm">Select rating</span>
                  </div>
                  <input type="hidden" id="review-rating" required>
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-1.5 md:mb-2 flex items-center text-sm md:text-base">
                    <i class="fas fa-comment-dots text-yellow-500 mr-1.5 text-sm"></i>Your Review *
                  </label>
                  <div class="relative">
                    <textarea id="review-message" 
                              required
                              rows="4"
                              class="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-yellow-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none text-sm md:text-base"
                              placeholder="Share your experience..."></textarea>
                    <i class="fas fa-pencil-alt absolute right-3 md:right-4 top-3 md:top-4 text-yellow-300 text-base md:text-lg"></i>
                  </div>
                </div>

                <div id="review-success" class="hidden bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 text-green-800 px-3 py-3 md:px-4 md:py-4 rounded-lg md:rounded-xl flex items-center shadow-lg animate-fade-in">
                  <div class="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                    <i class="fas fa-check text-white text-sm md:text-base"></i>
                  </div>
                  <div>
                    <p class="font-bold text-sm md:text-base">Thank you for your review!</p>
                    <p class="text-xs md:text-sm">It will be visible after approval.</p>
                  </div>
                </div>

                <div id="review-error" class="hidden bg-gradient-to-r from-red-50 to-pink-50 border border-red-300 text-red-800 px-3 py-3 md:px-4 md:py-4 rounded-lg md:rounded-xl flex items-center shadow-lg">
                  <div class="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                    <i class="fas fa-exclamation-triangle text-white text-sm md:text-base"></i>
                  </div>
                  <span id="review-error-message" class="text-sm md:text-base">Something went wrong. Please try again.</span>
                </div>

                <button type="submit" 
                        class="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl hover:shadow-xl transition transform hover:scale-105 hover:from-yellow-500 hover:to-orange-600 flex items-center justify-center space-x-2 text-sm md:text-base">
                  <i class="fas fa-paper-plane text-sm md:text-base"></i>
                  <span>Submit Your Review</span>
                  <i class="fas fa-heart"></i>
                </button>
              </form>
            </div>
          </div>

          <!-- Recent Reviews Display -->
          <div id="reviews-list" class="space-y-4 md:space-y-6">
            <!-- Reviews will be loaded here -->
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Load categories
  loadHomeCategories();
  
  // Load featured products
  loadHomeFeaturedProducts();
  
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
        <div class="p-4 md:p-6 lg:p-8 text-center">
          <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300">
            <i class="fas ${category.icon || 'fa-folder'} text-white text-2xl md:text-3xl"></i>
          </div>
          <h3 class="font-bold text-base md:text-lg lg:text-xl mb-1 md:mb-2 text-gray-900">${category.name}</h3>
          <p class="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">${category.description || ''}</p>
          <span class="inline-flex items-center text-yellow-600 text-sm md:text-base font-semibold group-hover:text-yellow-700">
            Browse <i class="fas fa-arrow-right ml-1 md:ml-2 group-hover:translate-x-1 transition text-xs md:text-sm"></i>
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

// Load featured products for home page
async function loadHomeFeaturedProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const result = await response.json();
    const allProducts = result.data || result.products || result;
    
    const grid = document.getElementById('home-featured-products');
    if (!grid) return;
    
    if (!allProducts || allProducts.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-8">
          <i class="fas fa-box-open text-5xl text-gray-300 mb-3"></i>
          <p class="text-lg text-gray-500">No products available</p>
        </div>
      `;
      return;
    }
    
    // Prioritize products with images, then show remaining products
    const productsWithImages = allProducts.filter(p => p.images && p.images.length > 0);
    const productsWithoutImages = allProducts.filter(p => !p.images || p.images.length === 0);
    const sortedProducts = [...productsWithImages, ...productsWithoutImages];
    
    // Show first 4 products
    const featuredProducts = sortedProducts.slice(0, 4);
    
    grid.innerHTML = featuredProducts.map(product => `
      <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
        <div class="aspect-square bg-gradient-to-br from-yellow-50 to-gray-50 flex items-center justify-center p-2 md:p-3">
          ${product.images && product.images.length > 0 
            ? `<img src="${product.images[0]}" alt="${product.title || product.name}" class="w-full h-full object-contain group-hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400?text=Trophy'" />`
            : `<i class="fas fa-trophy text-yellow-400 text-3xl md:text-4xl opacity-50"></i>`
          }
        </div>
        <div class="p-2 md:p-3">
          <h4 class="font-bold text-sm md:text-base text-gray-900 mb-1 line-clamp-1">${product.title || product.name}</h4>
          <p class="text-xs text-gray-600 mb-1.5 md:mb-2 line-clamp-1">${product.description || 'Premium quality product'}</p>
          <div class="flex justify-between items-center">
            <span class="text-green-600 font-semibold text-xs md:text-sm flex items-center">
              <i class="fas fa-boxes mr-1"></i> Available in Bulk
            </span>
            <a href="#products" class="text-yellow-600 hover:text-yellow-700 text-xs font-semibold inline-flex items-center">
              View <i class="fas fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading featured products:', error);
    const grid = document.getElementById('home-featured-products');
    if (grid) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-8">
          <i class="fas fa-exclamation-triangle text-5xl text-red-300 mb-3"></i>
          <p class="text-lg text-gray-500">Error loading products</p>
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
          <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-4 md:p-6 text-white mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4">Why Choose Krishna Enterprises?</h2>
            <div class="grid md:grid-cols-2 gap-3 md:gap-4">
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">10+ Years of Experience</h3>
                  <p class="text-yellow-50 text-xs">Decade-long expertise in crafting premium trophies and awards.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Wide Product Range</h3>
                  <p class="text-yellow-50 text-xs">Extensive collection catering to all types of recognition needs.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Custom Design Services</h3>
                  <p class="text-yellow-50 text-xs">Personalized solutions tailored to your specific requirements.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Competitive Pricing</h3>
                  <p class="text-yellow-50 text-xs">Best quality products at fair and transparent prices.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Fast Delivery</h3>
                  <p class="text-yellow-50 text-xs">Quick turnaround times without compromising quality.</p>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <i class="fas fa-check-circle text-sm md:text-base flex-shrink-0 mt-1"></i>
                <div>
                  <h3 class="font-bold mb-0.5 text-xs md:text-sm">Local Presence</h3>
                  <p class="text-yellow-50 text-xs">Proudly serving Jaipur and Rajasthan with dedicated local service.</p>
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
        <div class="text-center py-8 md:py-12 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-xl md:rounded-2xl border border-dashed border-yellow-300 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-yellow-200 rounded-full opacity-20 blur-2xl"></div>
          <div class="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
          <div class="relative z-10">
            <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg mb-3 md:mb-4">
              <i class="fas fa-comments text-white text-3xl md:text-4xl"></i>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">No Reviews Yet!</h3>
            <p class="text-sm md:text-base text-gray-600 mb-3 px-4">Be the first to share your experience</p>
            <div class="flex items-center justify-center space-x-1">
              <i class="fas fa-star text-yellow-400 text-lg md:text-xl"></i>
              <i class="fas fa-star text-yellow-400 text-lg md:text-xl"></i>
              <i class="fas fa-star text-yellow-400 text-lg md:text-xl"></i>
              <i class="fas fa-star text-yellow-400 text-lg md:text-xl"></i>
              <i class="fas fa-star text-yellow-400 text-lg md:text-xl"></i>
            </div>
          </div>
        </div>
      `;
      return;
    }
    
    reviewsList.innerHTML = `
      <div class="mb-4 md:mb-6 text-center">
        <div class="inline-flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 md:px-6 md:py-3 rounded-full shadow-md">
          <i class="fas fa-comments text-yellow-600 text-lg md:text-xl"></i>
          <h3 class="text-base md:text-xl font-bold text-gray-900">Recent Reviews</h3>
          <span class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">${reviews.length}</span>
        </div>
      </div>
      ${reviews.map(review => `
        <div class="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-yellow-200 hover:border-yellow-300 transform hover:-translate-y-1 relative overflow-hidden group">
          <!-- Decorative quote mark -->
          <div class="absolute top-2 right-2 md:top-4 md:right-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition">
            <i class="fas fa-quote-right text-4xl md:text-5xl text-yellow-400"></i>
          </div>
          
          <div class="flex items-start space-x-3 mb-3 relative z-10">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ring-2 md:ring-3 ring-yellow-100">
              <i class="fas fa-user text-white text-sm md:text-base"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1.5">
                <h4 class="font-bold text-gray-900 text-sm md:text-base truncate pr-2">${escapeHtml(review.name)}</h4>
                <div class="flex items-center space-x-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm flex-shrink-0">
                  ${Array.from({length: 5}, (_, i) => `
                    <i class="fas fa-star ${i < review.rating ? 'text-white' : 'text-yellow-200'} text-xs"></i>
                  `).join('')}
                </div>
              </div>
              <div class="flex items-center space-x-1.5 text-xs text-gray-500">
                <i class="fas fa-calendar-alt text-yellow-500"></i>
                <span class="font-medium">
                  ${new Date(review.createdAt).toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span class="text-yellow-500">•</span>
                <i class="fas fa-check-circle text-green-500"></i>
                <span class="text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
          
          <div class="relative z-10">
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border-l-2 md:border-l-3 border-yellow-400">
              <p class="text-gray-700 leading-relaxed text-xs md:text-sm">${escapeHtml(review.message)}</p>
            </div>
          </div>
          
          <!-- Bottom decorative element -->
          <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition"></div>
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
