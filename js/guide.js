// ============================================
// ACCUEIL ÉCOLE INCLUSIVE - JAVASCRIPT
// Interactions avancées sans quiz
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Accueil École Inclusive chargé !');
    
    // ========== THÈMES DYNAMIQUES ==========
    const themes = {
        default: {
            '--deep-lavender': '#8A7FBA',
            '--rich-teal': '#4ECDC4',
            '--warm-coral': '#FF6B6B',
            '--soft-mauve': '#C9A8E6',
            '--dark-charcoal': '#2D3047'
        },
        sunset: {
            '--deep-lavender': '#FF8E72',
            '--rich-teal': '#FFB347',
            '--warm-coral': '#FF6B6B',
            '--soft-mauve': '#D4A5A5',
            '--dark-charcoal': '#3A2D39'
        },
        ocean: {
            '--deep-lavender': '#5D8AA8',
            '--rich-teal': '#3D9DB3',
            '--warm-coral': '#FF8C42',
            '--soft-mauve': '#8BB8C9',
            '--dark-charcoal': '#2A3B4D'
        },
        forest: {
            '--deep-lavender': '#6A8D73',
            '--rich-teal': '#4A7C59',
            '--warm-coral': '#FF9A8B',
            '--soft-mauve': '#A8C6A0',
            '--dark-charcoal': '#2D3B2D'
        }
    };
    
    let currentTheme = 'default';
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleFooter = document.getElementById('themeToggleFooter');
    
    function changeTheme() {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        currentTheme = themeKeys[nextIndex];
        
        const theme = themes[currentTheme];
        Object.keys(theme).forEach(variable => {
            document.documentElement.style.setProperty(variable, theme[variable]);
        });
        
        // Animation des boutons
        if (themeToggle) {
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 400);
        }
        
        // Notification
        showNotification(`Thème ${currentTheme} activé`);
    }
    
    if (themeToggle) themeToggle.addEventListener('click', changeTheme);
    if (themeToggleFooter) themeToggleFooter.addEventListener('click', changeTheme);
    
    // ========== NAVIGATION MOBILE ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.nav-elegant');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Fermer le menu mobile au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // ========== SCROLL EFFECTS ==========
    window.addEventListener('scroll', function() {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link
        updateActiveLink();
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(20px)';
                backToTop.style.visibility = 'hidden';
            }
        }
    });
    
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ========== ANIMATION DES STATISTIQUES DU HERO ==========
    function animateHeroStats() {
        const statNumbers = document.querySelectorAll('.hero-stats .number[data-count]');
        statNumbers.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            if (isNaN(target)) return;
            var duration = 2000;
            var startTime = null;
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var elapsed = timestamp - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var value = Math.floor(progress * target);
                stat.textContent = value;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    stat.textContent = target;
                }
            }
            window.requestAnimationFrame(step);
        });
    }
    // Déclencher l'animation 400 ms après le chargement (hero visible en haut de page)
    setTimeout(animateHeroStats, 400);
    
    // ========== ANIMATIONS AU SCROLL ==========
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.vision-card, .timeline-content, .value-card, ' +
            '.resource-category, .testimonial-card, .feature'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll', 'visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }
    
    // ========== EFFETS HOVER AVANCÉS ==========
    function initHoverEffects() {
        // Effet de brillance sur les cartes
        const cards = document.querySelectorAll('.vision-card, .value-card, .resource-category');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const shine = document.createElement('div');
                shine.className = 'card-shine';
                shine.style.cssText = `
                    position: absolute;
                    top: ${y}px;
                    left: ${x}px;
                    width: 0;
                    height: 0;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                    transform: translate(-50%, -50%);
                    animation: shineExpand 0.6s ease-out forwards;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                if (!document.querySelector('#shine-expand')) {
                    const style = document.createElement('style');
                    style.id = 'shine-expand';
                    style.textContent = `
                        @keyframes shineExpand {
                            to {
                                width: 300px;
                                height: 300px;
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(shine);
                
                setTimeout(() => {
                    if (shine.parentNode) {
                        shine.remove();
                    }
                }, 600);
            });
        });
        
        // Effet de parallaxe sur les icônes
        const icons = document.querySelectorAll('.vision-icon, .value-icon, .feature-icon');
        
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'rotateY(180deg) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'rotateY(0deg) scale(1)';
            });
        });
    }
    
    // ========== ANIMATION DES NEURONES ==========
    function initNeuronAnimation() {
        const brainGraphic = document.querySelector('.brain-graphic');
        if (!brainGraphic) return;
        
        const neurons = brainGraphic.querySelectorAll('.neuron');
        const svgNS = "http://www.w3.org/2000/svg";
        
        // Créer un SVG pour les connexions
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '0';
        brainGraphic.appendChild(svg);
        
        // Animer les connexions
        function animateConnections() {
            // Effacer les anciennes connexions
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            neurons.forEach((neuron1, i) => {
                neurons.forEach((neuron2, j) => {
                    if (i < j && Math.random() > 0.5) { // 50% de chance de connexion
                        const rect1 = neuron1.getBoundingClientRect();
                        const rect2 = neuron2.getBoundingClientRect();
                        const rect = brainGraphic.getBoundingClientRect();
                        
                        const x1 = (rect1.left + rect1.width/2) - rect.left;
                        const y1 = (rect1.top + rect1.height/2) - rect.top;
                        const x2 = (rect2.left + rect2.width/2) - rect.left;
                        const y2 = (rect2.top + rect2.height/2) - rect.top;
                        
                        // Dessiner une ligne
                        const line = document.createElementNS(svgNS, "line");
                        line.setAttribute('x1', x1);
                        line.setAttribute('y1', y1);
                        line.setAttribute('x2', x2);
                        line.setAttribute('y2', y2);
                        line.setAttribute('stroke', 'rgba(255, 107, 107, 0.3)');
                        line.setAttribute('stroke-width', '1');
                        line.setAttribute('stroke-dasharray', '5,5');
                        
                        // Animation
                        line.style.animation = `neuronDash ${Math.random() * 3 + 2}s linear infinite`;
                        svg.appendChild(line);
                    }
                });
            });
        }
        
        // Ajouter l'animation CSS pour le dash
        if (!document.querySelector('#neuron-dash')) {
            const style = document.createElement('style');
            style.id = 'neuron-dash';
            style.textContent = `
                @keyframes neuronDash {
                    to { stroke-dashoffset: -20; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Mettre à jour les connexions
        animateConnections();
        setInterval(animateConnections, 3000); // Changement toutes les 3 secondes
    }
    
    // ========== FLOATING ELEMENTS ==========
    function initFloatingElements() {
        const elements = document.querySelectorAll('.floating-elements .element');
        
        elements.forEach(element => {
            // Animation de flottement aléatoire
            setInterval(() => {
                const x = Math.random() * 40 - 20;
                const y = Math.random() * 40 - 20;
                const rotate = Math.random() * 20 - 10;
                
                element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
            }, 3000);
        });
    }
    
    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--pure-white);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-hard);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-left: 4px solid ${type === 'success' ? 'var(--rich-teal)' : 
                               type === 'error' ? 'var(--warm-coral)' : 
                               'var(--deep-lavender)'};
        `;
        
        document.body.appendChild(notification);
        
        // Afficher
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Cacher après 3 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // ========== INTERACTIVE TIMELINE ==========
    function initInteractiveTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            
            // Animation au survol
            item.addEventListener('mouseenter', function() {
                const marker = this.querySelector('.timeline-marker');
                if (marker) {
                    marker.style.transform = 'scale(1.2)';
                    marker.style.boxShadow = 'var(--shadow-medium)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const marker = this.querySelector('.timeline-marker');
                if (marker) {
                    marker.style.transform = 'scale(1)';
                    marker.style.boxShadow = 'var(--shadow-soft)';
                }
            });
        });
    }
    
    // ========== SMOOTH SCROLLING ==========
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ========== COUNTER ANIMATION FOR CTA ==========
    function initCTACounters() {
        const ctaStats = document.querySelector('.cta-stats');
        if (!ctaStats) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numbers = entry.target.querySelectorAll('.number');
                    numbers.forEach(number => {
                        const target = parseInt(number.textContent);
                        let current = 0;
                        const duration = 1500;
                        const increment = target / (duration / 16);
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            number.textContent = Math.floor(current);
                        }, 16);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(ctaStats);
    }
    
    // ========== LAZY LOADING IMAGES ==========
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les anciens navigateurs
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
    
    // ========== INITIALISATION ==========
    function initAll() {
        initScrollAnimations();
        initHoverEffects();
        initNeuronAnimation();
        initFloatingElements();
        initInteractiveTimeline();
        initSmoothScrolling();
        initCTACounters();
        initLazyLoading();
        
        console.log('Toutes les fonctionnalités sont initialisées !');
        
        // Notification de bienvenue
        setTimeout(() => {
            showNotification('Bienvenue sur notre guide pédagogique !', 'info');
        }, 1000);
    }
    
    // Démarrer l'initialisation
    initAll();
    
    // ========== UTILITAIRES ==========
    
    // Fonction pour vérifier si un élément est visible
    window.isElementVisible = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Fonction pour créer une animation de succès
    window.createSuccessAnimation = function(element, message = 'Succès !') {
        const success = document.createElement('div');
        success.className = 'success-animation';
        success.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        success.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gradient-secondary);
            color: var(--pure-white);
            padding: 1rem 2rem;
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1000;
            opacity: 0;
            animation: successPop 0.5s ease forwards;
            box-shadow: var(--shadow-medium);
        `;
        
        if (!document.querySelector('#success-pop')) {
            const style = document.createElement('style');
            style.id = 'success-pop';
            style.textContent = `
                @keyframes successPop {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    70% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.appendChild(success);
        
        setTimeout(() => {
            success.style.opacity = '0';
            success.style.transform = 'translate(-50%, -50%) scale(0.😎';
            setTimeout(() => {
                if (success.parentNode) {
                    success.remove();
                }
            }, 300);
        }, 2000);
    };
    
    // ========== PERFORMANCE OPTIMIZATION ==========
    
    // Désactiver les animations pendant le scroll pour la performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        document.body.classList.add('disable-animations');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('disable-animations');
        }, 100);
    });
    
    // Ajouter le CSS pour désactiver les animations
    const performanceStyle = document.createElement('style');
    performanceStyle.textContent = `
        body.disable-animations * {
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
        }
    `;
    document.head.appendChild(performanceStyle);
});