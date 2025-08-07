// Global variables
let currentSlide = 0;
let currentMakeupSlide = 0;
let cart = [];
let isLoggedIn = false;

// Hero Slider functionality
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function currentSlideIndex(index) {
    currentSlide = index - 1;
    showSlide(currentSlide);
}

// Auto-play slider
setInterval(nextSlide, 5000);

// Makeup brushes slider
function showMakeupSlide(index) {
    const slides = document.querySelectorAll('.makeup-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}
 // Hamburger menu toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
  });
function nextMakeupSlide() {
    const slides = document.querySelectorAll('.makeup-slide');
    currentMakeupSlide = (currentMakeupSlide + 1) % slides.length;
    showMakeupSlide(currentMakeupSlide);
}

function prevMakeupSlide() {
    const slides = document.querySelectorAll('.makeup-slide');
    currentMakeupSlide = (currentMakeupSlide - 1 + slides.length) % slides.length;
    showMakeupSlide(currentMakeupSlide);
}

// Auto-play makeup slider
setInterval(nextMakeupSlide, 4000);

// User Modal functionality
function openUserModal() {
    document.getElementById('userModal').style.display = 'block';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

function showLogin() {
    document.getElementById('loginTab').classList.remove('hidden');
    document.getElementById('registerTab').classList.add('hidden');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('loginTab').classList.add('hidden');
    document.getElementById('registerTab').classList.remove('hidden');
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// Cart functionality
function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

// Product data
const products = {
    1: {
        id: 1,
        name: 'Kérastase Nutritive',
        price: 89.90,
        image: 'kerastase-product.png',
        description: 'Shampoo nutritivo para cabelos secos'
    },
    2: {
        id: 2,
        name: 'Carolina Herrera',
        price: 389.90,
        image: 'carolina-herrera-perfume.png',
        description: 'Perfume Good Girl 80ml'
    },
    3: {
        id: 3,
        name: 'L\'Oréal Revitalift',
        price: 79.90,
        image: 'loreal-serum.png',
        description: 'Sérum anti-idade com vitamina C'
    },
    4: {
        id: 4,
        name: 'Kit Pincéis Profissionais',
        price: 159.90,
        image: 'makeup-slide-1.png',
        description: 'Set completo com 12 pincéis'
    }
};

// Add to cart functionality
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();
    updateCartCount();
    
    // Show success feedback
    showAddToCartFeedback();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h4 style="margin-bottom: 0.5rem;">${item.name}</h4>
                <p style="color: #666; font-size: 0.9rem;">${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                    <span style="font-weight: 600;">R$ ${item.price.toFixed(2)}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="background: #f0f0f0; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="background: #f0f0f0; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                        <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;">×</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        updateCartCount();
    }
}

function showAddToCartFeedback() {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = 'Produto adicionado ao carrinho!';
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #9b59b6;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Quick view functionality
function quickView(productId) {
    const product = products[productId];
    if (!product) return;

    // Create quick view modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div style="display: flex; gap: 2rem; align-items: center;">
                <img src="${product.image}" alt="${product.name}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px;">
                <div>
                    <h2>${product.name}</h2>
                    <p style="color: #666; margin: 1rem 0;">${product.description}</p>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #9b59b6; margin: 1rem 0;">
                        R$ ${product.price.toFixed(2)}
                    </div>
                    <button onclick="addToCart(${product.id}); this.parentElement.parentElement.parentElement.parentElement.parentElement.remove();" 
                            style="background: #9b59b6; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    if (!isLoggedIn) {
        alert('Por favor, faça login para continuar com a compra.');
        closeCart();
        openUserModal();
        return;
    }

    // Simulate checkout process
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const confirmed = confirm(`Finalizar compra no valor de R$ ${total.toFixed(2)}?`);
    
    if (confirmed) {
        // Simulate payment processing
        alert('Compra realizada com sucesso! Você receberá um e-mail de confirmação.');
        cart = [];
        updateCartDisplay();
        updateCartCount();
        closeCart();
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // Simulate login API call
        setTimeout(() => {
            isLoggedIn = true;
            alert('Login realizado com sucesso!');
            closeUserModal();
            
            // Update user button to show logged in state
            const userBtn = document.querySelector('.user-btn');
            userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
            userBtn.style.color = '#4CAF50';
        }, 1000);
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // Simulate registration API call
        setTimeout(() => {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            showLogin();
        }, 1000);
    });

    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simulate newsletter subscription
        if (email) {
            alert('Obrigado por se inscrever! Você receberá nossas novidades em breve.');
            this.querySelector('input[type="email"]').value = '';
        }
    });
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const userModal = document.getElementById('userModal');
    if (e.target === userModal) {
        closeUserModal();
    }
});

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

function toggleMenu() {
  const menu = document.getElementById("menuOverlay");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}
let currentProductId = null;

function showProductDetails(productId, title, description, imageSrc, price) {
  currentProductId = productId;
  document.getElementById('modalProductTitle').textContent = title;
  document.getElementById('modalProductDescription').textContent = description;
  document.getElementById('modalProductImage').src = imageSrc;
  document.getElementById('modalProductPrice').textContent = price;

  document.getElementById('productModal').style.display = 'block';
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}
function filterProducts() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const sort = document.getElementById('sortSelect').value;
  const products = Array.from(document.querySelectorAll('.product-card'));

  // Filtro por nome
  products.forEach(prod => {
    const title = prod.querySelector('h3').textContent.toLowerCase();
    prod.style.display = title.includes(input) ? 'block' : 'none';
  });

  // Ordenação
  let visibleProducts = products.filter(p => p.style.display !== 'none');

  if (sort === 'name') {
    visibleProducts.sort((a, b) => {
      const nameA = a.querySelector('h3').textContent.toLowerCase();
      const nameB = b.querySelector('h3').textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sort === 'price-low' || sort === 'price-high') {
    visibleProducts.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('R$', '').replace(',', '.'));
      const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('R$', '').replace(',', '.'));
      return sort === 'price-low' ? priceA - priceB : priceB - priceA;
    });
  }

  const grid = document.querySelector('.product-grid');
  visibleProducts.forEach(p => grid.appendChild(p));
}
let bannerIndex = 0;
const banners = document.querySelectorAll('.banner-slide');

function showBannerSlide(index) {
  banners.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

function nextBannerSlide() {
  bannerIndex = (bannerIndex + 1) % banners.length;
  showBannerSlide(bannerIndex);
}

function prevBannerSlide() {
  bannerIndex = (bannerIndex - 1 + banners.length) % banners.length;
  showBannerSlide(bannerIndex);
}

// Auto-slide a cada 5 segundos
setInterval(() => {
  nextBannerSlide();
}, 5000);


// Função que filtra os produtos pelo texto digitado
function filterProducts() {
  // Pegamos o texto do campo de busca, já convertido para minúsculo
  const input = document.getElementById('searchInput').value.toLowerCase();

  // Selecionamos todos os produtos com a classe 'product-card'
  const products = document.querySelectorAll('.product-card');

  // Para cada produto da lista...
  products.forEach(product => {
    // Pegamos o texto do título do produto (dentro da tag <h3>)
    const title = product.querySelector('h3').textContent.toLowerCase();

    // Verificamos se o nome digitado está contido no título
    if (title.includes(input)) {
      // Se sim, mostramos o produto
      product.style.display = 'block';
    } else {
      // Se não, escondemos o produto
      product.style.display = 'none';
    }
  });
}

