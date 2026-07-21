/* ===================================================
   KHANA KHAZANA — Main JavaScript
   =================================================== */

(function () {
  'use strict';

  // ─── Sticky Navbar scroll effect ───
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ─── Mobile Hamburger Menu ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  function closeMenu() {
    hamburger && hamburger.classList.remove('open');
    navLinks && navLinks.classList.remove('open');
    navOverlay && navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  function openMenu() {
    hamburger && hamburger.classList.add('open');
    navLinks && navLinks.classList.add('open');
    navOverlay && navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }
  // Close on nav link click (mobile)
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── Reveal on Scroll (IntersectionObserver) ───
  const revealSections = document.querySelectorAll('.reveal-section');
  if (revealSections.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealSections.forEach(section => revealObserver.observe(section));
  }

  // ─── Back to Top ───
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Toast Notifications ───
  window.showToast = function (message, duration = 2200) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  };

  // =========================================================
  //  CART SYSTEM (with localStorage)
  // =========================================================

  const CART_KEY = 'khanakhazana_cart';

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  let cart = loadCart();

  // Expose globally for onclick handlers
  window.addToCart = function (name, price) {
    const idx = cart.findIndex(item => item.name === name);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    showToast(`✓ ${name} added to cart`);
  };

  window.removeFromCart = function (name) {
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
    renderCart();
  };

  window.changeQty = function (name, delta) {
    const idx = cart.findIndex(item => item.name === name);
    if (idx > -1) {
      cart[idx].qty += delta;
      if (cart[idx].qty < 1) {
        cart.splice(idx, 1);
      }
    }
    saveCart(cart);
    renderCart();
  };

  window.clearCart = function () {
    cart = [];
    saveCart(cart);
    renderCart();
    showToast('Cart cleared');
  };

  function renderCart() {
    const cartList = document.getElementById('cart-list');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotalRow = document.getElementById('cart-total-row');
    const cartActions = document.getElementById('cart-actions');
    const cartTotalEl = document.getElementById('cart-total');
    const navCartCount = document.getElementById('nav-cart-count');

    if (!cartList) return; // not on order page

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Update badge
    if (cartBadge) cartBadge.textContent = totalItems;
    if (navCartCount) {
      navCartCount.textContent = totalItems;
      navCartCount.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }

    // Empty state
    if (cart.length === 0) {
      cartList.innerHTML = '<li class="cart-empty-msg">Your cart is empty. Add some delicious items!</li>';
      if (cartTotalRow) cartTotalRow.style.display = 'none';
      if (cartActions) cartActions.style.display = 'none';
      return;
    }

    // Render items
    cartList.innerHTML = '';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-qty-group">
          <button class="qty-btn" onclick="changeQty('${item.name}', -1)" aria-label="Decrease">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.name}', 1)" aria-label="Increase">+</button>
        </span>
        <span class="cart-item-price">₹${item.price * item.qty}</span>
        <button class="remove-item-btn" onclick="removeFromCart('${item.name}')" aria-label="Remove" title="Remove">✕</button>
      `;
      cartList.appendChild(li);
    });

    if (cartTotalEl) cartTotalEl.textContent = `₹${totalPrice}`;
    if (cartTotalRow) cartTotalRow.style.display = 'flex';
    if (cartActions) cartActions.style.display = 'flex';
  }

  // Initial render
  renderCart();

  // =========================================================
  //  ORDER FORM HANDLING
  // =========================================================

  window.handleOrderSubmit = function (e) {
    e.preventDefault();

    const form = document.getElementById('order-form');
    const msgEl = document.getElementById('form-message');
    if (!form || !msgEl) return false;

    // Validate
    const fname = form.fname.value.trim();
    const lname = form.lname.value.trim();
    const mobile = form.mobile.value.trim();
    const email = form.email.value.trim();
    const pincode = form.pincode.value.trim();
    const address = form.address.value.trim();
    const gender = form.gender.value;
    const payment = form.payment.value;

    // Clear previous
    msgEl.textContent = '';
    msgEl.className = 'form-message';
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    // Validation checks
    if (!fname) { showFieldError(form.fname, msgEl, 'Please enter your first name.'); return false; }
    if (!lname) { showFieldError(form.lname, msgEl, 'Please enter your last name.'); return false; }
    if (!gender) { msgEl.textContent = 'Please select your gender.'; msgEl.className = 'form-message error'; return false; }
    if (!/^\d{10}$/.test(mobile)) { showFieldError(form.mobile, msgEl, 'Please enter a valid 10-digit mobile number.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError(form.email, msgEl, 'Please enter a valid email address.'); return false; }
    if (!/^\d{6}$/.test(pincode)) { showFieldError(form.pincode, msgEl, 'Please enter a valid 6-digit pincode.'); return false; }
    if (!payment) { showFieldError(form.payment, msgEl, 'Please select a payment mode.'); return false; }
    if (!address) { showFieldError(form.address, msgEl, 'Please enter your delivery address.'); return false; }

    // Check cart
    if (cart.length === 0) {
      msgEl.textContent = 'Your cart is empty. Please add items before placing an order.';
      msgEl.className = 'form-message error';
      return false;
    }

    // Success
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const payLabel = payment === 'cod' ? 'Cash on Delivery' : payment === 'upi' ? 'UPI' : 'Card';

    const modalMsg = document.getElementById('modal-message');
    if (modalMsg) {
      modalMsg.textContent = `Thank you, ${fname}! Your order of ₹${totalPrice} will be delivered to your address. Payment mode: ${payLabel}.`;
    }

    // Show modal
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.add('active');

    // Clear cart & form
    cart = [];
    saveCart(cart);
    renderCart();
    form.reset();

    return false;
  };

  function showFieldError(field, msgEl, message) {
    field.classList.add('invalid');
    field.focus();
    msgEl.textContent = message;
    msgEl.className = 'form-message error';
  }

  window.closeModal = function () {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('active');
  };

  // Close modal on overlay click
  const modalOverlay = document.getElementById('order-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        window.closeModal();
      }
    });
  }

})();
