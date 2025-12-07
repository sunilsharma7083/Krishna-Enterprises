/**
 * RESPONSIVE UTILITIES FOR KRISHNA ENTERPRISES
 * Handles mobile menu, touch interactions, and responsive behaviors
 */

(function() {
  'use strict';

  // ===== MOBILE MENU TOGGLE =====
  const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
        
        // Change icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          if (mobileMenu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars';
          } else {
            icon.className = 'fas fa-times';
          }
        }
      });
      
      // Close mobile menu when clicking on links
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('active');
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) icon.className = 'fas fa-bars';
        });
      });
    }
  };

  // ===== ADMIN SIDEBAR TOGGLE (Mobile) =====
  const initAdminSidebar = () => {
    // Create toggle button if it doesn't exist
    let toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebar && !toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'sidebar-toggle md:hidden';
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
      toggleBtn.setAttribute('aria-label', 'Toggle Sidebar');
      document.body.appendChild(toggleBtn);
      
      // Create overlay
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
      }
      
      // Toggle sidebar
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
      });
      
      // Close on overlay click
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
      
      // Close on sidebar link click (mobile)
      if (window.innerWidth < 768) {
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
          link.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
          });
        });
      }
    }
  };

  // ===== RESPONSIVE IMAGES =====
  const initResponsiveImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  };

  // ===== RESPONSIVE TABLES =====
  const initResponsiveTables = () => {
    const tables = document.querySelectorAll('table:not(.no-responsive)');
    
    tables.forEach(table => {
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
      
      // Add data-label to cells for mobile view
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
          if (headers[index]) {
            cell.setAttribute('data-label', headers[index]);
          }
        });
      });
    });
  };

  // ===== VIEWPORT HEIGHT FIX (Mobile browsers) =====
  const setViewportHeight = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // ===== TOUCH DEVICE DETECTION =====
  const detectTouchDevice = () => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.add('no-touch');
    }
  };

  // ===== SCREEN ORIENTATION CHANGE =====
  const handleOrientationChange = () => {
    // Close mobile menu on orientation change
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('active');
      
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    }
    
    // Close admin sidebar on orientation change (if mobile)
    if (window.innerWidth < 768) {
      const sidebar = document.querySelector('.admin-sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      if (sidebar) sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
    
    // Update viewport height
    setViewportHeight();
  };

  // ===== WINDOW RESIZE HANDLER =====
  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setViewportHeight();
      
      // Hide mobile menu on desktop
      if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('active');
        }
        
        // Show admin sidebar on desktop
        const sidebar = document.querySelector('.admin-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      }
    }, 250);
  };

  // ===== SMOOTH SCROLL TO TOP =====
  const initScrollToTop = () => {
    // Create button if it doesn't exist
    let scrollBtn = document.getElementById('scroll-to-top');
    
    if (!scrollBtn) {
      scrollBtn = document.createElement('button');
      scrollBtn.id = 'scroll-to-top';
      scrollBtn.className = 'fixed bottom-24 right-6 bg-gray-900 text-white p-3 rounded-full shadow-lg hidden hover:bg-gray-800 transition z-50';
      scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      scrollBtn.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(scrollBtn);
      
      // Show/hide on scroll
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollBtn.classList.remove('hidden');
        } else {
          scrollBtn.classList.add('hidden');
        }
      });
      
      // Scroll to top on click
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ===== PREVENT ZOOM ON INPUT FOCUS (iOS) =====
  const preventInputZoom = () => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const fontSize = window.getComputedStyle(input).fontSize;
        if (parseFloat(fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });
    }
  };

  // ===== LAZY LOAD CONTENT =====
  const initLazyLoad = () => {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add('lazy-loaded');
            element.removeAttribute('data-lazy');
            lazyObserver.unobserve(element);
          }
        });
      });
      
      lazyElements.forEach(element => lazyObserver.observe(element));
    }
  };

  // ===== ACCESSIBILITY: FOCUS TRAP IN MODALS =====
  const trapFocusInModal = (modal) => {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        const closeBtn = modal.querySelector('[data-dismiss="modal"]');
        if (closeBtn) closeBtn.click();
      }
    });
  };

  // ===== PERFORMANCE: DEBOUNCE FUNCTION =====
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ===== INITIALIZE ALL =====
  const init = () => {
    // Core responsive features
    detectTouchDevice();
    setViewportHeight();
    initMobileMenu();
    initAdminSidebar();
    initResponsiveImages();
    initResponsiveTables();
    initScrollToTop();
    initLazyLoad();
    preventInputZoom();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Trap focus in modals
    document.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal && modal.classList.contains('show')) {
        trapFocusInModal(modal);
      }
    });
    
    console.log('✅ Responsive utilities initialized');
  };

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities to global scope if needed
  window.ResponsiveUtils = {
    setViewportHeight,
    debounce,
    initResponsiveTables
  };

})();
