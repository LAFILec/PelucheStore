let cart = [];
let isCartOpen = false;
let isMobileMenuOpen = false;

class PlushStoreApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeBackgroundEffects();
        this.loadCartFromStorage();
        this.optimizeForDevice();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });

        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            
            if (isMobileMenuOpen && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
                if (isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            }, 100);
        });
    }

    initializeBackgroundEffects() {
        const backgroundEffects = document.getElementById('backgroundEffects');
        
        this.createFloatingElements();
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.05;
            backgroundEffects.style.transform = `translateY(${parallax}px)`;
        }, 16));
    }

    createFloatingElements() {
        const backgroundEffects = document.getElementById('backgroundEffects');
        const elementCount = window.innerWidth > 768 ? 6 : 3;

        for (let i = 0; i < elementCount; i++) {
            setTimeout(() => {
                this.createFloatingParticle(backgroundEffects);
            }, i * 3000);
        }

        for (let i = 0; i < Math.floor(elementCount / 2); i++) {
            setTimeout(() => {
                this.createFloatingShape(backgroundEffects);
            }, i * 8000 + 4000);
        }

        setInterval(() => {
            if (document.visibilityState === 'visible' && !this.isReducedMotion()) {
                if (Math.random() > 0.7) {
                    this.createFloatingParticle(backgroundEffects);
                }
                if (Math.random() > 0.85) {
                    this.createFloatingShape(backgroundEffects);
                }
            }
        }, 12000);
    }

    createFloatingParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 3;
        const startX = Math.random() * 100;
        const hue = 220 + Math.random() * 60;
        const opacity = Math.random() * 0.3 + 0.2;
        
        particle.style.cssText = `
            position: absolute;
            left: ${startX}%;
            top: 100%;
            width: ${size}px;
            height: ${size}px;
            background: hsla(${hue}, 60%, 70%, ${opacity});
            border-radius: 50%;
            animation: floatUp ${20 + Math.random() * 15}s linear infinite;
            pointer-events: none;
        `;

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 35000);
    }

    createFloatingShape(container) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        const size = Math.random() * 8 + 6;
        const startY = Math.random() * 100;
        const hue = 160 + Math.random() * 40;
        const opacity = Math.random() * 0.2 + 0.15;
        
        shape.style.cssText = `
            position: absolute;
            left: -20px;
            top: ${startY}%;
            width: ${size}px;
            height: ${size}px;
            background: hsla(${hue}, 50%, 65%, ${opacity});
            border-radius: 20%;
            animation: floatDiagonal ${25 + Math.random() * 20}s linear infinite;
            pointer-events: none;
        `;

        container.appendChild(shape);

        setTimeout(() => {
            if (shape.parentNode) {
                shape.parentNode.removeChild(shape);
            }
        }, 45000);
    }

    isReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    loadCartFromStorage() {
        try {
            const savedCart = JSON.parse(sessionStorage.getItem('plushCart') || '[]');
            cart = savedCart;
            this.updateCartUI();
        } catch (error) {
            cart = [];
        }
    }

    saveCartToStorage() {
        try {
            sessionStorage.setItem('plushCart', JSON.stringify(cart));
        } catch (error) {
            console.warn('Error saving cart');
        }
    }

    addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            this.showNotification('Este producto ya está en tu carrito', 'warning');
            return;
        }

        const item = {
            id: id,
            name: name,
            price: price,
            image: image,
            timestamp: Date.now()
        };

        cart.push(item);
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification(`${name} agregado al carrito`, 'success');
        this.disableProductButton(id);
        this.createAddToCartEffect(event.target);
    }

    removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        this.saveCartToStorage();
        this.updateCartUI();
        this.enableProductButton(id);
        this.showNotification('Producto removido del carrito', 'info');
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const btnCheckout = document.getElementById('btnCheckout');

        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'block' : 'none';

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            btnCheckout.disabled = true;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remover producto">
                        ×
                    </button>
                </div>
            `).join('');
            btnCheckout.disabled = false;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = total.toFixed(2);
    }

    disableProductButton(productId) {
        const productCard = document.querySelector(`[data-id="${productId}"]`);
        if (productCard) {
            const button = productCard.querySelector('.btn-add-cart');
            if (button) {
                button.disabled = true;
                button.textContent = 'En Carrito';
                button.style.opacity = '0.6';
            }
        }
    }

    enableProductButton(productId) {
        const productCard = document.querySelector(`[data-id="${productId}"]`);
        if (productCard) {
            const button = productCard.querySelector('.btn-add-cart');
            if (button) {
                button.disabled = false;
                button.textContent = 'Agregar al Carrito';
                button.style.opacity = '1';
            }
        }
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        isMobileMenuOpen = !isMobileMenuOpen;
        
        if (isMobileMenuOpen) {
            navMenu.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        
        isCartOpen = !isCartOpen;
        
        if (isCartOpen) {
            cartSidebar.classList.add('active');
            cartBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('active');
            cartBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    proceedToCheckout() {
        if (cart.length === 0) return;
        
        const checkoutModal = document.getElementById('checkoutModal');
        const orderItems = document.getElementById('orderItems');
        const orderTotal = document.getElementById('orderTotal');

        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <span>${item.name}</span>
                <span>${item.price.toFixed(2)}</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        orderTotal.textContent = total.toFixed(2);

        checkoutModal.classList.add('active');
        checkoutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        this.toggleCart();
        this.createCheckoutCelebration();
    }

    closeCheckout() {
        const checkoutModal = document.getElementById('checkoutModal');
        checkoutModal.classList.remove('active');
        checkoutModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeAllModals() {
        if (isCartOpen) this.toggleCart();
        if (isMobileMenuOpen) this.toggleMobileMenu();
        this.closeCheckout();
    }

    createAddToCartEffect(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(45deg, #8b7cf8, #ff6b9d);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: particleSpread 1s ease-out forwards;
                `;

                const angle = (i * 60) * Math.PI / 180;
                const velocity = 80;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particle.style.setProperty('--vx', vx + 'px');
                particle.style.setProperty('--vy', vy + 'px');

                document.body.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 50);
        }
    }

    createCheckoutCelebration() {
        const colors = ['#8b7cf8', '#ff6b9d', '#4ecdc4', '#ffd54f', '#81c784'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1001;
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                `;

                document.body.appendChild(confetti);

                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 4000);
            }, i * 50);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#81c784',
            warning: '#ffd54f',
            error: '#ff8a80',
            info: '#4ecdc4'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 1002;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            word-wrap: break-word;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile && isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
        
        const cartSidebar = document.getElementById('cartSidebar');
        if (isMobile && isCartOpen) {
            cartSidebar.style.width = '100vw';
        } else if (!isMobile && isCartOpen) {
            cartSidebar.style.width = '400px';
        }
    }

    optimizeForDevice() {
        const isMobile = window.innerWidth <= 768;
        const isTouch = 'ontouchstart' in window;
        
        if (isMobile) {
            document.body.classList.add('mobile-device');
        }

        if (isTouch) {
            document.body.classList.add('touch-device');
        }

        cart.forEach(item => {
            this.disableProductButton(item.id);
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

function addToCart(id, name, price, image) {
    app.addToCart(id, name, price, image);
}

function removeFromCart(id) {
    app.removeFromCart(id);
}

function toggleCart() {
    app.toggleCart();
}

function toggleMobileMenu() {
    app.toggleMobileMenu();
}

function proceedToCheckout() {
    app.proceedToCheckout();
}

function closeCheckout() {
    app.closeCheckout();
}

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(100vh) translateX(0px) scale(0.8) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-50px) translateX(30px) scale(0.4) rotate(180deg);
            opacity: 0;
        }
    }

    @keyframes floatDiagonal {
        0% {
            transform: translateX(-50px) translateY(100vh) rotate(0deg) scale(0.5);
            opacity: 0;
        }
        15% {
            opacity: 0.4;
        }
        85% {
            opacity: 0.2;
        }
        100% {
            transform: translateX(calc(100vw + 50px)) translateY(-50px) rotate(90deg) scale(0.2);
            opacity: 0;
        }
    }

    @keyframes particleSpread {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy)) scale(0);
            opacity: 0;
        }
    }

    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(dynamicStyles);

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new PlushStoreApp();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.querySelectorAll('.floating-particle, .floating-shape').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        document.querySelectorAll('.floating-particle, .floating-shape').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

window.addEventListener('beforeunload', () => {
    if (app && cart.length > 0) {
        app.saveCartToStorage();
    }
});
