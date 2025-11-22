// script.js - JavaScript functionality for CampusSupply Hub

// Product data
const products = [
  {
    id: 1,
    name: "Spiral Notebook (200 pages)",
    price: 400,
    image: "images/spiral notebook.jpg",
    description: "High-quality 200-page spiral notebook for all your note-taking needs"
  },
  {
    id: 2,
    name: "Ballpoint Pen Pack (12)",
    price: 600,
    image: "images/ballpoint pen.jpg",
    description: "Pack of 12 smooth-writing ballpoint pens in assorted colors"
  },
  {
    id: 3,
    name: "Mechanical Pencil (0.5mm)",
    price: 250,
    image: "images/mechanical pencil.jpeg",
    description: "Precision 0.5mm mechanical pencil with comfortable grip"
  },
  {
    id: 4,
    name: "Geometry Set",
    price: 900,
    image: "images/geometry set.jpg",
    description: "Complete geometry set with ruler, compass, protractor, and triangles"
  },
  {
    id: 5,
    name: "Scientific Calculator",
    price: 4500,
    image: "images/scientific calculator.jpg",
    description: "Advanced scientific calculator with 300+ functions"
  },
  {
    id: 6,
    name: "Highlighter Pack (6)",
    price: 550,
    image: "images/highlighter pack.jpg",
    description: "Set of 6 vibrant highlighters for effective studying"
  },
  {
    id: 7,
    name: "Durable Student Backpack",
    price: 5800,
    image: "images/student backpack.jpg",
    description: "Spacious and durable backpack with laptop compartment"
  },
  {
    id: 8,
    name: "Sticky Notes Pack",
    price: 300,
    image: "images/sticky notes.jpg",
    description: "Colorful sticky notes pack for reminders and annotations"
  }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load products on homepage
  if (document.getElementById('products-container')) {
    loadProducts();
  }
  
  // Load cart on cart page
  if (document.getElementById('cart-items')) {
    loadCart();
  }
  
  // Update cart count in navigation
  updateCartCount();
  
  // Setup form validation
  setupFormValidation();
});

// Load products onto the homepage
function loadProducts() {
  const container = document.getElementById('products-container');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('article');
    productCard.className = 'card';
    productCard.setAttribute('aria-label', `Product: ${product.name}`);
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300.png?text=Product+Image'">
      <div style="font-weight:700">${product.name}</div>
      <div class="small">${product.description}</div>
      <div style="font-weight:600; color: var(--brand-1);">JMD ${product.price.toLocaleString()}</div>
      <div style="margin-top:auto">
        <button class="btn add-to-cart" data-id="${product.id}">Add to cart</button>
      </div>
    `;
    
    container.appendChild(productCard);
  });
  
  // Add event listeners to add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-id'));
      addToCart(productId);
    });
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update UI
  updateCartCount();
  
  // Show success message
  showMessage(`${product.name} added to cart!`, 'success');
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  loadCart();
}

// Update product quantity in cart
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }
  
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
  }
}

// Load cart items on cart page
function loadCart() {
  const container = document.getElementById('cart-items');
  const subtotalElement = document.getElementById('cart-subtotal');
  const discountElement = document.getElementById('cart-discount');
  const taxElement = document.getElementById('cart-tax');
  const totalElement = document.getElementById('cart-total');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/50x50.png?text=Product'">
          ${item.name}
        </div>
      </td>
      <td>JMD ${item.price.toLocaleString()}</td>
      <td>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </td>
      <td>JMD ${itemTotal.toLocaleString()}</td>
      <td><button class="btn ghost" onclick="removeFromCart(${item.id})">Remove</button></td>
    `;
    
    container.appendChild(row);
  });
  
  // Calculate totals
  const discount = subtotal > 5000 ? 200 : 0;
  const tax = (subtotal - discount) * 0.15;
  const total = subtotal - discount + tax;
  
  // Update total displays
  if (subtotalElement) subtotalElement.textContent = `JMD ${subtotal.toLocaleString()}`;
  if (discountElement) discountElement.textContent = `-JMD ${discount.toLocaleString()}`;
  if (taxElement) taxElement.textContent = `JMD ${tax.toLocaleString()}`;
  if (totalElement) totalElement.textContent = `JMD ${total.toLocaleString()}`;
}

// Update cart count in navigation
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('#cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    
    // Show/hide badge based on cart contents
    if (totalItems > 0) {
      element.style.display = 'inline-flex';
    } else {
      element.style.display = 'none';
    }
  });
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
    showMessage('Cart cleared!', 'success');
  }
}

// Show message to user
function showMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageElement = document.createElement('div');
  messageElement.className = `message ${type === 'success' ? 'success-message' : ''}`;
  messageElement.textContent = message;
  
  // Insert at top of main content
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(messageElement, main.firstChild);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 3000);
  }
}

// Setup form validation
function setupFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
  });
}

// Validate form
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      highlightError(input, 'This field is required');
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      isValid = false;
      highlightError(input, 'Please enter a valid email address');
    } else {
      removeError(input);
    }
  });
  
  return isValid;
}

// Highlight field with error
function highlightError(field, message) {
  removeError(field);
  
  field.style.borderColor = 'var(--brand-2)';
  
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.color = 'var(--brand-2)';
  errorElement.style.fontSize = '0.8rem';
  errorElement.style.marginTop = '0.25rem';
  errorElement.textContent = message;
  
  field.parentNode.appendChild(errorElement);
}

// Remove error highlighting
function removeError(field) {
  field.style.borderColor = '';
  
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Checkout functionality
function processCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before checking out.');
    return false;
  }
  
  // In a real application, you would process payment here
  // For this demo, we'll just show a success message and clear the cart
  
  const invoiceNumber = 'INV-' + Date.now();
  localStorage.setItem('lastInvoice', invoiceNumber);
  
  // Redirect to invoice page
  window.location.href = 'invoice.html';
  return false;
}

// Generate invoice
function generateInvoice() {
  const invoiceNumber = localStorage.getItem('lastInvoice') || 'INV-2025-SS-001';
  const invoiceDate = new Date().toISOString().split('T')[0];
  
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const discount = subtotal > 5000 ? 200 : 0;
  const tax = (subtotal - discount) * 0.15;
  const total = subtotal - discount + tax;
  
  // Update invoice page if we're on it
  const invoiceNumberElement = document.getElementById('invoice-number');
  const invoiceDateElement = document.getElementById('invoice-date');
  const invoiceItemsElement = document.getElementById('invoice-items');
  const invoiceSubtotalElement = document.getElementById('invoice-subtotal');
  const invoiceDiscountElement = document.getElementById('invoice-discount');
  const invoiceTaxElement = document.getElementById('invoice-tax');
  const invoiceTotalElement = document.getElementById('invoice-total');
  
  if (invoiceNumberElement) invoiceNumberElement.textContent = invoiceNumber;
  if (invoiceDateElement) invoiceDateElement.textContent = invoiceDate;
  
  if (invoiceItemsElement) {
    invoiceItemsElement.innerHTML = '';
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>JMD ${item.price.toLocaleString()}</td>
        <td>JMD ${itemTotal.toLocaleString()}</td>
      `;
      invoiceItemsElement.appendChild(row);
    });
  }
  
  if (invoiceSubtotalElement) invoiceSubtotalElement.textContent = `JMD ${subtotal.toLocaleString()}`;
  if (invoiceDiscountElement) invoiceDiscountElement.textContent = `-JMD ${discount.toLocaleString()}`;
  if (invoiceTaxElement) invoiceTaxElement.textContent = `JMD ${tax.toLocaleString()}`;
  if (invoiceTotalElement) invoiceTotalElement.textContent = `JMD ${total.toLocaleString()}`;
  
  // Clear cart after generating invoice
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Initialize invoice if on invoice page
if (window.location.pathname.includes('invoice.html')) {
  document.addEventListener('DOMContentLoaded', generateInvoice);
}