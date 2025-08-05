class MagicAnimationEngine {
    constructor() {
        this.magicCanvas = document.getElementById('magicCanvas');
        this.geometricOverlay = document.getElementById('geometricOverlay');
        this.isAnimationActive = true;
        this.particles = [];
        this.shapes = [];
        this.init();
    }

    init() {
        this.startParticleSystem();
        this.startGeometricSystem();
        this.initInteractionEffects();
        this.optimizePerformance();
    }

    startParticleSystem() {
        const createParticle = () => {
            if (!this.isAnimationActive) return;
            
            const particle = document.createElement('div');
            particle.className = 'floating-particle magic-effect';
            
            const size = Math.random() * 8 + 4;
            const hue = Math.random() * 60 + 220;
            const saturation = Math.random() * 30 + 70;
            const lightness = Math.random() * 20 + 60;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            particle.style.animationDuration = (Math.random() * 8 + 12) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            this.magicCanvas.appendChild(particle);
            this.particles.push(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                    this.particles = this.particles.filter(p => p !== particle);
                }
            }, 20000);
        };

        createParticle();
        setInterval(createParticle, 2000);
        
        for (let i = 0; i < 5; i++) {
            setTimeout(createParticle, i * 800);
        }
    }

    startGeometricSystem() {
        const shapes = ['triangle', 'hexagon', 'circle', 'square'];
        
        const createGeometricShape = () => {
            if (!this.isAnimationActive) return;
            
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            
            shape.className = `geometric-shape ${shapeType} magic-effect`;
            
            const size = Math.random() * 25 + 15;
            const colors = ['var(--accent-coral)', 'var(--accent-gold)', 'var(--primary-fresh)', 'var(--accent-sage)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            if (shapeType === 'triangle') {
                const borderSize = size / 2;
                shape.style.borderLeft = `${borderSize}px solid transparent`;
                shape.style.borderRight = `${borderSize}px solid transparent`;
                shape.style.borderBottom = `${size}px solid ${color}`;
            } else if (shapeType === 'circle') {
                shape.style.width = size + 'px';
                shape.style.height = size + 'px';
                shape.style.borderRadius = '50%';
                shape.style.background = color;
            } else if (shapeType === 'square') {
                shape.style.width = size + 'px';
                shape.style.height = size + 'px';
                shape.style.background = color;
                shape.style.borderRadius = '20%';
            } else if (shapeType === 'hexagon') {
                shape.style.background = color;
            }
            
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDuration = (Math.random() * 12 + 18) + 's';
            shape.style.animationDelay = Math.random() * 3 + 's';
            
            this.geometricOverlay.appendChild(shape);
            this.shapes.push(shape);
            
            setTimeout(() => {
                if (shape.parentNode) {
                    shape.parentNode.removeChild(shape);
                    this.shapes = this.shapes.filter(s => s !== shape);
                }
            }, 30000);
        };

        createGeometricShape();
        setInterval(createGeometricShape, 4000);
        
        for (let i = 0; i < 3; i++) {
            setTimeout(createGeometricShape, i * 1500);
        }
    }

    initInteractionEffects() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => this.createSparkleEffect(e.target));
            card.addEventListener('click', (e) => this.createRippleEffect(e));
        });

        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.createButtonEffect(e));
        });
    }

    createSparkleEffect(element) {
        const sparkleCount = 6;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle-effect magic-effect';
                sparkle.innerHTML = '✨';
                
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                
                sparkle.style.position = 'absolute';
                sparkle.style.left = x + 'px';
                sparkle.style.top = y + 'px';
                sparkle.style.zIndex = '10';
                
                element.style.position = 'relative';
                element.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 2500);
            }, i * 200);
        }
    }

    createRippleEffect(event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect magic-effect';
        
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 0.8;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        event.currentTarget.style.position = 'relative';
        event.currentTarget.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1500);
    }

    createButtonEffect(event) {
        const colors = ['var(--accent-gold)', 'var(--primary-fresh)', 'var(--accent-coral)'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '6px';
                particle.style.height = '6px';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.borderRadius = '50%';
                particle.style.left = event.clientX + 'px';
                particle.style.top = event.clientY + 'px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1002';
                
                const angle = (i * 45) * Math.PI / 180;
                const velocity = 100;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particle.style.animation = `buttonParticle 1s ease-out forwards`;
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

    optimizePerformance() {
        document.addEventListener('visibilitychange', () => {
            this.isAnimationActive = !document.hidden;
            
            if (document.hidden) {
                this.particles.forEach(p => p.style.animationPlayState = 'paused');
                this.shapes.forEach(s => s.style.animationPlayState = 'paused');
            } else {
                this.particles.forEach(p => p.style.animationPlayState = 'running');
                this.shapes.forEach(s => s.style.animationPlayState = 'running');
            }
        });

        let throttleTimer = null;
        window.addEventListener('resize', () => {
            if (throttleTimer) return;
            
            throttleTimer = setTimeout(() => {
                this.cleanup();
                throttleTimer = null;
            }, 250);
        });
    }

    cleanup() {
        const allEffects = document.querySelectorAll('.magic-effect');
        allEffects.forEach(effect => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        });
        this.particles = [];
        this.shapes = [];
    }
}

class ModalController {
    constructor() {
        this.modal = document.getElementById('purchaseModal');
        this.modalProductName = document.getElementById('modalProductName');
        this.modalPrice = document.getElementById('modalPrice');
        this.init();
    }

    init() {
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-backdrop')) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });
    }

    open(productName, price) {
        this.modalProductName.textContent = productName;
        this.modalPrice.textContent = price;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        this.createCelebration();
        
        setTimeout(() => {
            this.modal.querySelector('.modal-content').style.animation = 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    createCelebration() {
        const colors = ['#7B68EE', '#FF6B9D', '#4ECDC4', '#FFD54F', '#81C784'];
        const shapes = ['circle', 'square', 'triangle'];
        
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                confetti.className = `confetti-piece confetti-${shape}`;
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1001';
                
                if (shape === 'triangle') {
                    confetti.style.width = '0';
                    confetti.style.height = '0';
                    confetti.style.borderLeft = '5px solid transparent';
                    confetti.style.borderRight = '5px solid transparent';
                    confetti.style.borderBottom = `10px solid ${color}`;
                } else {
                    confetti.style.width = '8px';
                    confetti.style.height = '8px';
                    confetti.style.backgroundColor = color;
                }
                
                confetti.style.animation = `confettiDrop ${Math.random() * 3 + 2}s ease-out forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, i * 80);
        }
    }
}

class ResponsiveController {
    constructor() {
        this.init();
    }

    init() {
        this.handleViewportChanges();
        this.optimizeForDevice();
        
        window.addEventListener('resize', this.debounce(() => {
            this.handleViewportChanges();
        }, 250));

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleViewportChanges();
            }, 100);
        });
    }

    handleViewportChanges() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
        
        if (width <= 480) {
            document.body.classList.add('mobile-small');
        } else {
            document.body.classList.remove('mobile-small');
        }

        if (width <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }

        if (width >= 1200) {
            document.body.classList.add('desktop-large');
        } else {
            document.body.classList.remove('desktop-large');
        }
    }

    optimizeForDevice() {
        const isTouch = 'ontouchstart' in window;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isTouch || isMobile) {
            document.body.classList.add('touch-device');
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
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
}

const animationEngine = new MagicAnimationEngine();
const modalController = new ModalController();
const responsiveController = new ResponsiveController();

function openModal(productName, price) {
    modalController.open(productName, price);
}

function closeModal() {
    modalController.close();
}

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes buttonParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(dynamicStyles);

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 La Fil - Tienda mágica cargada correctamente');
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
        card.style.animation = 'heroEntry 0.6s ease-out forwards';
    });
});