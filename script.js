// State Management
class AppState {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.products = [];
        this.currentPage = 'home';
        this.isAuthMode = 'login'; // 'login' or 'register'
        this.currentCheckoutStep = 1;
        
        this.loadProducts();
        this.updateCartCount();
        this.initializeEventListeners();
    }

    // Product Management
    loadProducts() {
        // Sample products data
        this.products = [
            {
                id: 1,
                name: 'Base Líquida HD',
                category: 'maquiagem',
                price: 89.90,
                originalPrice: 129.90,
                image: '💄',
                description: 'Base líquida de alta cobertura com acabamento natural e proteção UV.'
            },
            {
                id: 2,
                name: 'Batom Matte Premium',
                category: 'maquiagem',
                price: 45.90,
                originalPrice: null,
                image: '💋',
                description: 'Batom com textura cremosa e acabamento matte de longa duração.'
            },
            {
                id: 3,
                name: 'Sérum Anti-idade',
                category: 'skincare',
                price: 156.90,
                originalPrice: 199.90,
                image: '✨',
                description: 'Sérum concentrado com vitamina C e ácido hialurônico.'
            },
            {
                id: 4,
                name: 'Perfume Floral Elegance',
                category: 'perfumes',
                price: 298.90,
                originalPrice: null,
                image: '🌸',
                description: 'Fragrância sofisticada com notas florais e amadeiradas.'
            },
            {
                id: 5,
                name: 'Shampoo Hidratante',
                category: 'cabelos',
                price: 34.90,
                originalPrice: 49.90,
                image: '🧴',
                description: 'Shampoo enriquecido com óleo de argan para cabelos secos.'
            },
            {
                id: 6,
                name: 'Esmalte Gel UV',
                category: 'unhas',
                price: 28.90,
                originalPrice: null,
                image: '💅',
                description: 'Esmalte em gel de longa duração com secagem UV.'
            },
            {
                id: 7,
                name: 'Paleta de Sombras',
                category: 'maquiagem',
                price: 125.90,
                originalPrice: 159.90,
                image: '🎨',
                description: 'Paleta com 12 cores neutras e vibrantes.'
            },
            {
                id: 8,
                name: 'Hidratante Facial',
                category: 'skincare',
                price: 67.90,
                originalPrice: null,
                image: '🧴',
                description: 'Hidratante facial com FPS 30 para uso diário.'
            }
        ];
    }

    // Cart Management
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showMessage('Produto adicionado ao carrinho!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                this.renderCart();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            cartCountEl.textContent = count;
        }
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Favorites Management
    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showMessage('Produto removido dos favoritos', 'success');
        } else {
            this.favorites.push(productId);
            this.showMessage('Produto adicionado aos favoritos!', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoriteButtons();
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.product-favorite, .favorite-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            const icon = btn.querySelector('i');
            
            if (this.favorites.includes(productId)) {
                btn.classList.add('active');
                if (icon) icon.className = 'fas fa-heart';
            } else {
                btn.classList.remove('active');
                if (icon) icon.className = 'far fa-heart';
            }
        });
    }

    // User Management
    login(email, password) {
        // Simulate login - in real app, this would call an API
        const user = {
            id: 1,
            name: 'Maria Silva',
            email: email,
            phone: '(11) 99999-9999',
            birth: '1990-05-15'
        };

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.showMessage('Login realizado com sucesso!', 'success');
        this.closeModal('loginModal');
        this.showPage('user');
        this.renderUserProfile();
    }

    register(name, email, password) {
        // Simulate registration - in real app, this would call an API
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            phone: '',
            birth: ''
        };

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.showMessage('Conta criada com sucesso!', 'success');
        this.closeModal('loginModal');
        this.showPage('user');
        this.renderUserProfile();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showMessage('Logout realizado com sucesso!', 'success');
        this.showPage('home');
    }

    updateProfile(data) {
        if (this.currentUser) {
            Object.assign(this.currentUser, data);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showMessage('Perfil atualizado com sucesso!', 'success');
        }
    }

    // Order Management
    createOrder(orderData) {
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: this.getCartTotal() + 15, // Including shipping
            status: 'pending',
            date: new Date().toISOString(),
            address: orderData.address,
            payment: orderData.payment
        };

        this.orders.push(order);
        localStorage.setItem('orders', JSON.stringify(this.orders));
        this.clearCart();
        
        this.showMessage('Pedido realizado com sucesso!', 'success');
        this.closeModal('checkoutModal');
        this.showPage('user');
        this.showUserSection('orders');
        this.renderOrders();

        return order;
    }

    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order && order.status === 'pending') {
            order.status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(this.orders));
            this.showMessage('Pedido cancelado com sucesso!', 'success');
            this.renderOrders();
            this.closeModal('orderModal');
        }
    }

    // UI Management
    showPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Load page-specific content
        switch (pageId) {
            case 'home':
                this.renderFeaturedProducts();
                break;
            case 'categorias':
                this.renderAllProducts();
                break;
            case 'sobre':
                this.renderGallery();
                break;
            case 'user':
                if (!this.currentUser) {
                    this.showModal('loginModal');
                    return;
                }
                this.renderUserProfile();
                this.renderOrders();
                this.renderFavorites();
                break;
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showMessage(message, type = 'success') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;

        // Add to page
        document.body.appendChild(messageEl);

        // Position message
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.zIndex = '3000';
        messageEl.style.minWidth = '300px';

        // Auto remove after 3 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    showUserSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.user-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Show section
        document.querySelectorAll('.user-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // Rendering Methods
    renderFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;

        const featuredProducts = this.products.slice(0, 4);
        container.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
        this.updateFavoriteButtons();
    }

    renderAllProducts(filteredProducts = null) {
        const container = document.getElementById('allProducts');
        if (!container) return;

        const products = filteredProducts || this.products;
        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
        this.updateFavoriteButtons();
    }

    createProductCard(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <span style="font-size: 3rem;">${product.image}</span>
                    <button class="product-favorite" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${this.getCategoryName(product.category)}</p>
                    <div class="product-price">
                        <span class="current-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                        ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                    </div>
                    <button class="add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    }

    getCategoryName(category) {
        const names = {
            'maquiagem': 'Maquiagem',
            'skincare': 'Skincare',
            'perfumes': 'Perfumes',
            'cabelos': 'Cabelos',
            'unhas': 'Unhas'
        };
        return names[category] || category;
    }

    renderCart() {
        const container = document.getElementById('cartItems');
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');
        
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione produtos para continuar</p>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
            if (totalEl) totalEl.textContent = 'R$ 15,00';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <span>${item.image}</span>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                           onchange="app.updateCartQuantity(${item.id}, parseInt(this.value))">
                    <button class="qty-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="app.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const subtotal = this.getCartTotal();
        const shipping = 15;
        const total = subtotal + shipping;

        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    renderUserProfile() {
        if (!this.currentUser) return;

        const nameEl = document.getElementById('userName');
        const profileNameEl = document.getElementById('profileName');
        const profileEmailEl = document.getElementById('profileEmail');
        const profilePhoneEl = document.getElementById('profilePhone');
        const profileBirthEl = document.getElementById('profileBirth');

        if (nameEl) nameEl.textContent = this.currentUser.name;
        if (profileNameEl) profileNameEl.value = this.currentUser.name || '';
        if (profileEmailEl) profileEmailEl.value = this.currentUser.email || '';
        if (profilePhoneEl) profilePhoneEl.value = this.currentUser.phone || '';
        if (profileBirthEl) profileBirthEl.value = this.currentUser.birth || '';
    }

    renderOrders() {
        const container = document.getElementById('ordersList');
        if (!container) return;

        if (this.orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Seus pedidos aparecerão aqui</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.orders.map(order => `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-header">
                    <span class="order-number">Pedido #${order.id}</span>
                    <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                </div>
                <div class="order-info">
                    <div>Data: ${new Date(order.date).toLocaleDateString()}</div>
                    <div>Items: ${order.items.length}</div>
                    <div>Total: R$ ${order.total.toFixed(2).replace('.', ',')}</div>
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const texts = {
            'pending': 'Pendente',
            'confirmed': 'Confirmado',
            'shipped': 'Enviado',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        };
        return texts[status] || status;
    }

    renderFavorites() {
        const container = document.getElementById('favoritesList');
        if (!container) return;

        const favoriteProducts = this.products.filter(p => this.favorites.includes(p.id));

        if (favoriteProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>Nenhum favorito</h3>
                    <p>Adicione produtos aos favoritos</p>
                </div>
            `;
            return;
        }

        container.innerHTML = favoriteProducts.map(product => this.createProductCard(product)).join('');
        this.updateFavoriteButtons();
    }

    renderGallery() {
        const container = document.getElementById('gallery');
        if (!container) return;

        // Sample gallery images
        const galleryItems = [
            { id: 1, alt: 'Produtos de maquiagem' },
            { id: 2, alt: 'Skincare premium' },
            { id: 3, alt: 'Perfumes exclusivos' },
            { id: 4, alt: 'Cuidados com cabelo' },
            { id: 5, alt: 'Nail art' },
            { id: 6, alt: 'Beleza natural' }
        ];

        container.innerHTML = galleryItems.map((item, index) => `
            <div class="gallery-item">
                <div style="width: 100%; height: 100%; background: var(--bg-light); display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                    ${['💄', '✨', '🌸', '💇‍♀️', '💅', '🧴'][index]}
                </div>
            </div>
        `).join('');
    }

    renderProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const nameEl = document.getElementById('productName');
        const imageEl = document.getElementById('productMainImage');
        const priceEl = document.getElementById('productPrice');
        const originalPriceEl = document.getElementById('productOriginalPrice');
        const descriptionEl = document.getElementById('productDescription');
        const quantityEl = document.getElementById('productQuantity');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const favoriteBtn = document.getElementById('favoriteBtn');

        if (nameEl) nameEl.textContent = product.name;
        if (imageEl) {
            imageEl.style.display = 'none';
            imageEl.parentElement.innerHTML = `<div style="width: 100%; height: 400px; background: var(--bg-light); display: flex; align-items: center; justify-content: center; font-size: 6rem; border-radius: var(--border-radius);">${product.image}</div>`;
        }
        if (priceEl) priceEl.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        if (originalPriceEl) {
            if (product.originalPrice) {
                originalPriceEl.textContent = `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`;
                originalPriceEl.style.display = 'inline';
            } else {
                originalPriceEl.style.display = 'none';
            }
        }
        if (descriptionEl) descriptionEl.textContent = product.description;
        if (quantityEl) quantityEl.value = 1;

        if (addToCartBtn) {
            addToCartBtn.dataset.productId = product.id;
        }

        if (favoriteBtn) {
            favoriteBtn.dataset.productId = product.id;
            const icon = favoriteBtn.querySelector('i');
            if (this.favorites.includes(product.id)) {
                favoriteBtn.classList.add('active');
                if (icon) icon.className = 'fas fa-heart';
            } else {
                favoriteBtn.classList.remove('active');
                if (icon) icon.className = 'far fa-heart';
            }
        }
    }

    renderOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const container = document.getElementById('orderDetails');
        if (!container) return;

        container.innerHTML = `
            <div class="order-summary">
                <div class="summary-section">
                    <h4>Informações do Pedido</h4>
                    <p><strong>Número:</strong> #${order.id}</p>
                    <p><strong>Data:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span></p>
                </div>
                
                <div class="summary-section">
                    <h4>Produtos</h4>
                    ${order.items.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <span>${item.image}</span>
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} x ${item.quantity}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="summary-section">
                    <h4>Endereço de Entrega</h4>
                    <p>${order.address ? `${order.address.street}, ${order.address.number}` : 'Não informado'}</p>
                </div>

                <div class="summary-total">
                    <div class="total-line total">
                        <span>Total:</span>
                        <span>R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </div>
        `;

        const cancelBtn = document.getElementById('cancelOrderBtn');
        if (cancelBtn) {
            if (order.status === 'pending') {
                cancelBtn.style.display = 'inline-block';
                cancelBtn.dataset.orderId = order.id;
            } else {
                cancelBtn.style.display = 'none';
            }
        }
    }

    // Checkout Management
    nextCheckoutStep() {
        if (this.currentCheckoutStep < 3) {
            this.currentCheckoutStep++;
            this.updateCheckoutStep();
        }
    }

    prevCheckoutStep() {
        if (this.currentCheckoutStep > 1) {
            this.currentCheckoutStep--;
            this.updateCheckoutStep();
        }
    }

    updateCheckoutStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= this.currentCheckoutStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Show/hide step content
        document.querySelectorAll('.checkout-step').forEach((step, index) => {
            if (index + 1 === this.currentCheckoutStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update buttons
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const finishBtn = document.getElementById('finishOrderBtn');

        if (prevBtn) prevBtn.style.display = this.currentCheckoutStep > 1 ? 'inline-block' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentCheckoutStep < 3 ? 'inline-block' : 'none';
        if (finishBtn) finishBtn.style.display = this.currentCheckoutStep === 3 ? 'inline-block' : 'none';

        // Populate step 3 with order summary
        if (this.currentCheckoutStep === 3) {
            this.renderCheckoutSummary();
        }
    }

    renderCheckoutSummary() {
        const orderItemsEl = document.getElementById('orderItems');
        const addressEl = document.getElementById('deliveryAddress');
        const paymentEl = document.getElementById('paymentMethod');
        const totalEl = document.getElementById('orderTotal');

        if (orderItemsEl) {
            orderItemsEl.innerHTML = this.cart.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
            `).join('');
        }

        if (addressEl) {
            const street = document.getElementById('street')?.value || '';
            const number = document.getElementById('number')?.value || '';
            const city = document.getElementById('city')?.value || '';
            addressEl.textContent = `${street}, ${number} - ${city}`;
        }

        if (paymentEl) {
            const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value || '';
            const paymentNames = {
                'credit': 'Cartão de Crédito',
                'debit': 'Cartão de Débito',
                'pix': 'PIX'
            };
            paymentEl.textContent = paymentNames[selectedPayment] || 'Não selecionado';
        }

        if (totalEl) {
            const total = this.getCartTotal() + 15;
            totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }

    finishOrder() {
        const addressData = {
            street: document.getElementById('street')?.value,
            number: document.getElementById('number')?.value,
            complement: document.getElementById('complement')?.value,
            neighborhood: document.getElementById('neighborhood')?.value,
            city: document.getElementById('city')?.value,
            state: document.getElementById('state')?.value,
            cep: document.getElementById('cep')?.value
        };

        const paymentData = {
            method: document.querySelector('input[name="payment"]:checked')?.value,
            cardNumber: document.getElementById('cardNumber')?.value,
            cardName: document.getElementById('cardName')?.value
        };

        this.createOrder({
            address: addressData,
            payment: paymentData
        });
    }

    // Filter and Search
    filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter')?.value;
        const priceFilter = document.getElementById('priceFilter')?.value;
        const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase();

        let filtered = [...this.products];

        if (categoryFilter) {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
            filtered = filtered.filter(p => p.price >= min && (max ? p.price <= max : true));
        }

        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                this.getCategoryName(p.category).toLowerCase().includes(searchTerm)
            );
        }

        this.renderAllProducts(filtered);
    }

    // Initialize Event Listeners
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage(link.dataset.page);
            });
        });

        // Category cards
        document.querySelectorAll('[data-category]').forEach(card => {
            card.addEventListener('click', () => {
                this.showPage('categorias');
                setTimeout(() => {
                    const categoryFilter = document.getElementById('categoryFilter');
                    if (categoryFilter) {
                        categoryFilter.value = card.dataset.category;
                        this.filterProducts();
                    }
                }, 100);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('nav');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }

        // User button
        const userBtn = document.getElementById('userBtn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                if (this.currentUser) {
                    this.showPage('user');
                } else {
                    this.showModal('loginModal');
                }
            });
        }

        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.renderCart();
                this.showModal('cartModal');
            });
        }

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                if (this.currentPage === 'categorias') {
                    this.filterProducts();
                }
            });
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.filterProducts());
        }

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Auth form
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('authEmail').value;
                const password = document.getElementById('authPassword').value;
                const name = document.getElementById('authName').value;

                if (this.isAuthMode === 'login') {
                    this.login(email, password);
                } else {
                    this.register(name, email, password);
                }
            });
        }

        // Auth mode switch
        const authSwitchLink = document.getElementById('authSwitchLink');
        if (authSwitchLink) {
            authSwitchLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthMode();
            });
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = {
                    name: document.getElementById('profileName').value,
                    email: document.getElementById('profileEmail').value,
                    phone: document.getElementById('profilePhone').value,
                    birth: document.getElementById('profileBirth').value
                };
                this.updateProfile(data);
            });
        }

        // User navigation
        document.querySelectorAll('.user-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id === 'logoutBtn') {
                    this.logout();
                } else {
                    this.showUserSection(btn.dataset.section);
                }
            });
        });

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showMessage('Mensagem enviada com sucesso!', 'success');
                contactForm.reset();
            });
        }

        // Cart actions
        const continueShopping = document.getElementById('continueShopping');
        if (continueShopping) {
            continueShopping.addEventListener('click', () => {
                this.closeModal('cartModal');
            });
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showMessage('Carrinho vazio!', 'error');
                    return;
                }
                
                if (!this.currentUser) {
                    this.closeModal('cartModal');
                    this.showModal('loginModal');
                    return;
                }

                this.closeModal('cartModal');
                this.currentCheckoutStep = 1;
                this.updateCheckoutStep();
                this.showModal('checkoutModal');
            });
        }

        // Checkout navigation
        const nextStepBtn = document.getElementById('nextStepBtn');
        const prevStepBtn = document.getElementById('prevStepBtn');
        const finishOrderBtn = document.getElementById('finishOrderBtn');

        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                this.nextCheckoutStep();
            });
        }

        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => {
                this.prevCheckoutStep();
            });
        }

        if (finishOrderBtn) {
            finishOrderBtn.addEventListener('click', () => {
                this.finishOrder();
            });
        }

        // Product quantity controls in modal
        const decreaseQty = document.getElementById('decreaseQty');
        const increaseQty = document.getElementById('increaseQty');
        const productQuantity = document.getElementById('productQuantity');

        if (decreaseQty) {
            decreaseQty.addEventListener('click', () => {
                const current = parseInt(productQuantity.value);
                if (current > 1) {
                    productQuantity.value = current - 1;
                }
            });
        }

        if (increaseQty) {
            increaseQty.addEventListener('click', () => {
                const current = parseInt(productQuantity.value);
                productQuantity.value = current + 1;
            });
        }

        // Add to cart from modal
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const productId = parseInt(addToCartBtn.dataset.productId);
                const quantity = parseInt(document.getElementById('productQuantity').value);
                this.addToCart(productId, quantity);
                this.closeModal('productModal');
            });
        }

        // Favorite button in modal
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                const productId = parseInt(favoriteBtn.dataset.productId);
                this.toggleFavorite(productId);
            });
        }

        // Order details
        const closeOrderDetailsBtn = document.getElementById('closeOrderDetailsBtn');
        if (closeOrderDetailsBtn) {
            closeOrderDetailsBtn.addEventListener('click', () => {
                this.closeModal('orderModal');
            });
        }

        const cancelOrderBtn = document.getElementById('cancelOrderBtn');
        if (cancelOrderBtn) {
            cancelOrderBtn.addEventListener('click', () => {
                const orderId = parseInt(cancelOrderBtn.dataset.orderId);
                if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                    this.cancelOrder(orderId);
                }
            });
        }

        // CTA button
        const ctaBtn = document.querySelector('.cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                this.showPage('categorias');
            });
        }

        // Dynamic event listeners for products
        this.setupDynamicEventListeners();
    }

    setupDynamicEventListeners() {
        // Use event delegation for dynamic content
        document.addEventListener('click', (e) => {
            // Product cards
            if (e.target.closest('.product-card') && !e.target.closest('.product-favorite, .add-to-cart')) {
                const productId = parseInt(e.target.closest('.product-card').dataset.productId);
                this.renderProductModal(productId);
                this.showModal('productModal');
            }

            // Add to cart buttons
            if (e.target.closest('.add-to-cart')) {
                e.stopPropagation();
                const productId = parseInt(e.target.closest('.add-to-cart').dataset.productId);
                this.addToCart(productId);
            }

            // Favorite buttons
            if (e.target.closest('.product-favorite')) {
                e.stopPropagation();
                const productId = parseInt(e.target.closest('.product-favorite').dataset.productId);
                this.toggleFavorite(productId);
            }

            // Order items
            if (e.target.closest('.order-item')) {
                const orderId = parseInt(e.target.closest('.order-item').dataset.orderId);
                this.renderOrderDetails(orderId);
                this.showModal('orderModal');
            }
        });
    }

    toggleAuthMode() {
        const titleEl = document.getElementById('authTitle');
        const submitBtn = document.getElementById('authSubmitBtn');
        const switchText = document.getElementById('authSwitchText');
        const switchLink = document.getElementById('authSwitchLink');
        const nameGroup = document.getElementById('nameGroup');

        if (this.isAuthMode === 'login') {
            this.isAuthMode = 'register';
            if (titleEl) titleEl.textContent = 'Criar Conta';
            if (submitBtn) submitBtn.textContent = 'Cadastrar';
            if (switchText) switchText.innerHTML = 'Já tem uma conta? <a href="#" id="authSwitchLink">Faça login</a>';
            if (nameGroup) nameGroup.style.display = 'block';
        } else {
            this.isAuthMode = 'login';
            if (titleEl) titleEl.textContent = 'Entrar';
            if (submitBtn) submitBtn.textContent = 'Entrar';
            if (switchText) switchText.innerHTML = 'Não tem uma conta? <a href="#" id="authSwitchLink">Cadastre-se</a>';
            if (nameGroup) nameGroup.style.display = 'none';
        }

        // Re-attach event listener for the new switch link
        const newSwitchLink = document.getElementById('authSwitchLink');
        if (newSwitchLink) {
            newSwitchLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthMode();
            });
        }
    }
}

// Initialize the application
const app = new AppState();

// Load initial page
document.addEventListener('DOMContentLoaded', () => {
    app.showPage('home');
});

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    app.showPage(page);
});

