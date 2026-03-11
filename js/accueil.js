// ============================================
// SCRIPT PRINCIPAL DU SITE
// Animations et interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site Épilepsie à l\'École chargé avec succès !');
    
    // ========== LOADING ANIMATION ==========
    document.body.classList.add('loaded');
    
    // ========== NAVIGATION MOBILE ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Fermer le menu mobile au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // ========== NAVIGATION SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mettre à jour le lien actif
        updateActiveLink();
    });
    
    // ========== ACTIVE LINK ==========
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Utilisation de template literals pour construire l'URL avec ancre
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ========== ANIMATION DES CHIFFRES ==========
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }
    
    // Observer pour les statistiques
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(counter => {
                    animateCounter(counter);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // ========== CARTES ESPACES ==========
    const espaceCards = document.querySelectorAll('.espace-card');
    const cardActions = document.querySelectorAll('.card-action');
    
    espaceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Empêcher le retournement si on clique sur le bouton
            if (!e.target.closest('.card-action')) {
                this.querySelector('.card-inner').classList.toggle('flipped');
            }
        });
    });
    
    cardActions.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const target = this.getAttribute('data-target');
            if (target === 'enseignants') {
                window.location.href = 'espace-enseignants.html';
            } else if (target === 'eleves') {
                window.location.href = 'espace-eleves.html';
            } else if (target === 'parents') {
                window.location.href = 'espace-parents.html';
            }
        });
    });
    
    // ========== BOUTON RETOUR EN HAUT ==========
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ========== ANIMATION DES ÉLÉMENTS AU SCROLL ==========
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.objectif, .stat-card, .element, .espace-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialiser l'opacité pour l'animation
    document.querySelectorAll('.objectif, .stat-card, .element, .espace-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Déclencher une fois au chargement
    setTimeout(animateOnScroll, 100);
    
    // ========== ANIMATION DES NEURONES ==========
    function createNeuronConnection() {
        const brainAnimation = document.querySelector('.brain-animation');
        if (!brainAnimation) return;
        
        const neurons = brainAnimation.querySelectorAll('.neuron');
        const svgNS = "http://www.w3.org/2000/svg";
        
        // Créer un SVG pour les connexions
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '1';
        brainAnimation.appendChild(svg);
        
        // Animer les connexions
        function animateConnections() {
            // Effacer les anciennes connexions
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            neurons.forEach((neuron1, i) => {
                neurons.forEach((neuron2, j) => {
                    if (i < j) {
                        const x1 = neuron1.offsetLeft + neuron1.offsetWidth / 2;
                        const y1 = neuron1.offsetTop + neuron1.offsetHeight / 2;
                        const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
                        const y2 = neuron2.offsetTop + neuron2.offsetHeight / 2;
                        
                        // Dessiner une ligne
                        const line = document.createElementNS(svgNS, "line");
                        line.setAttribute('x1', x1);
                        line.setAttribute('y1', y1);
                        line.setAttribute('x2', x2);
                        line.setAttribute('y2', y2);
                        line.setAttribute('stroke', 'rgba(76, 201, 240, 0.3)');
                        line.setAttribute('stroke-width', '1');
                        line.setAttribute('stroke-dasharray', '5,5');
                        
                        // Animation (la propriété CSS doit être une chaîne)
                        line.style.animation = 'dash 3s linear infinite';
                        svg.appendChild(line);
                    }
                });
            });
        }
        
        // Ajouter l'animation CSS pour le dash
        if (!document.querySelector('#neuron-animation')) {
            const style = document.createElement('style');
            style.id = 'neuron-animation';
            style.textContent = `
                @keyframes dash {
                    to { stroke-dashoffset: -20; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Mettre à jour les connexions
        animateConnections();
        window.addEventListener('resize', animateConnections);
    }
    
    // Démarrer les connexions neuronales
    setTimeout(createNeuronConnection, 1000);
    
    // ========== EFFET DE TYPING ==========
    function typeWriterEffect() {
        const titles = document.querySelectorAll('.hero-title, .hero-subtitle');
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            
            let i = 0;
            function typeChar() {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeChar, 50);
                }
            }
            
            // Démarrer après un délai
            setTimeout(typeChar, 500);
        });
    }
    
    // ========== NOTIFICATION TOAST ==========
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#4CAF50' : '#2196F3'};
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
    
    // ========== INTERACTIVITÉ DES CARTES ==========
    document.querySelectorAll('.objectif').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ========== LANCEMENT DES ANIMATIONS ==========
    // Typing effect pour le hero
    setTimeout(typeWriterEffect, 100);
    
    // Animation initiale des statistiques
    setTimeout(() => {
        if (statsSection && window.scrollY > statsSection.offsetTop - 500) {
            statNumbers.forEach(counter => {
                animateCounter(counter);
            });
        }
    }, 1000);
    
    // ========== GESTION DES FORMULAIRES ==========
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            showNotification('Formulaire de contact bientôt disponible !');
        });
    });
    
    // ========== ANIMATION DU PULSE ==========
    const pulseElements = document.querySelectorAll('.pulse-ring');
    pulseElements.forEach((ring, index) => {
        ring.style.animationDelay = `${index}s`;
    });
    
    // ========== PRELOADER (optionnel) ==========
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    });
});