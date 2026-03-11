// ============================================
// ESPACE ENSEIGNANT - JAVASCRIPT
// Interactions, Animations & Fonctionnalités
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ========== VARIABLES GLOBALES ==========
    let currentTheme = 'pastel';
    let downloadedFiles = [];
    let quizScore = 0;
    
    // ========== THÈME & COULEURS ==========
    const themes = {
        pastel: {
            '--pastel-lavender': '#e6e6ff',
            '--pastel-mint': '#d4f1f9',
            '--pastel-peach': '#ffdac1',
            '--pastel-blush': '#ff9aa2',
            '--pastel-lemon': '#fffacd',
            '--pastel-sky': '#b5ead7',
            '--pastel-lilac': '#c7ceea',
            '--pastel-cream': '#fff9f0',
            '--pastel-teal': '#a2e1db',
            '--pastel-rose': '#ffc8dd',
            '--pastel-blue': '#a8d0e6',
            '--pastel-green': '#d4f4dd',
            '--pastel-yellow': '#fdfd96',
            '--pastel-coral': '#ffb7b2'
        },
        ocean: {
            '--pastel-lavender': '#c7f0ff',
            '--pastel-mint': '#a8e6cf',
            '--pastel-peach': '#ffd3b6',
            '--pastel-blush': '#ff8b94',
            '--pastel-lemon': '#fff8b0',
            '--pastel-sky': '#84dfe2',
            '--pastel-lilac': '#a6c1ee',
            '--pastel-cream': '#f5f7fa',
            '--pastel-teal': '#7fd1c7',
            '--pastel-rose': '#ffc2d4',
            '--pastel-blue': '#89c2d9',
            '--pastel-green': '#b0eacd',
            '--pastel-yellow': '#f7e78e',
            '--pastel-coral': '#ffaaa5'
        },
        forest: {
            '--pastel-lavender': '#d8e2dc',
            '--pastel-mint': '#b8e0d2',
            '--pastel-peach': '#ffd6c2',
            '--pastel-blush': '#ffb4a2',
            '--pastel-lemon': '#e9edc9',
            '--pastel-sky': '#a8dadc',
            '--pastel-lilac': '#cddafd',
            '--pastel-cream': '#fefae0',
            '--pastel-teal': '#8ac6c4',
            '--pastel-rose': '#ffc2cc',
            '--pastel-blue': '#a2d2ff',
            '--pastel-green': '#c9e4c5',
            '--pastel-yellow': '#f7e78e',
            '--pastel-coral': '#ffafcc'
        }
    };

    // ========== NAVIGATION MOBILE ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Fermer le menu mobile au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // ========== CHANGEMENT DE THÈME ==========
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
        
        // Animation du bouton
        if (themeToggle) {
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 400);
        }
        
        // Notification discrète
        showNotification(`Thème ${currentTheme} activé`);
    }
    
    if (themeToggle) themeToggle.addEventListener('click', changeTheme);
    if (themeToggleFooter) themeToggleFooter.addEventListener('click', changeTheme);

    // ========== ANIMATION DES STATISTIQUES ==========
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    }
    
    // Déclencher l'animation quand la section devient visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);

    // ========== CATÉGORIES DE RESSOURCES ==========
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Retirer la classe active de tous les onglets et contenus
            categoryTabs.forEach(t => t.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué et son contenu
            tab.classList.add('active');
            const targetContent = document.getElementById(`${category}-content`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // ========== TÉLÉCHARGEMENT DE PDF ==========
    const downloadButtons = document.querySelectorAll('.btn-download-pdf, .btn-download, .btn-download-small, .btn-matiere');
    
    downloadButtons.forEach(button => {
        if (button.hasAttribute('data-pdf')) return;
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const fileName = this.getAttribute('data-file') || 'document.pdf';
            simulateDownload(fileName);
            downloadedFiles.push({
                name: fileName,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            });
            updateDownloadCounter();
            this.innerHTML = '<i class="fas fa-check"></i> Téléchargé !';
            this.style.background = 'var(--pastel-green)';
            this.style.color = 'var(--text-dark)';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-download"></i> Télécharger';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });
    
    function simulateDownload(filename) {
        // Créer un élément de téléchargement fictif
        const downloadLink = document.createElement('a');
        downloadLink.href = '#';
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Notification
        showNotification(`Téléchargement de ${filename} démarré`);
    }
    
    function updateDownloadCounter() {
        const counter = document.querySelector('.stat-number[data-count="2000"]');
        if (counter) {
            const current = parseInt(counter.textContent.replace(/,/g, ''));
            counter.textContent = (current + 1).toLocaleString();
        }
    }

    // ========== GÉNÉRATEUR DE PAI ==========
    const generatePaiBtn = document.getElementById('generatePai');
    const paiInputs = {
        nom: document.getElementById('eleveNom'),
        niveau: document.getElementById('niveau'),
        besoins: document.getElementById('besoins')
    };
    const previewName = document.getElementById('previewName');
    const previewNom = document.getElementById('previewNom');
    
    // Mettre à jour l'aperçu en temps réel
    Object.values(paiInputs).forEach(input => {
        if (input) {
            input.addEventListener('input', updatePaiPreview);
        }
    });
    
    function updatePaiPreview() {
        if (previewNom && paiInputs.nom) {
            const nom = paiInputs.nom.value || 'Nom de l\'élève';
            previewNom.textContent = nom;
        }
    }
    
    if (generatePaiBtn) {
        generatePaiBtn.addEventListener('click', function() {
            if (!paiInputs.nom || !paiInputs.nom.value.trim()) {
                showNotification('Veuillez saisir le nom de l\'élève', 'warning');
                paiInputs.nom.focus();
                return;
            }
            
            // Générer le PAI
            const paiData = {
                eleve: paiInputs.nom.value,
                niveau: paiInputs.niveau.value,
                besoins: paiInputs.besoins.value,
                date: new Date().toLocaleDateString('fr-FR'),
                reference: `PAI-${Date.now().toString().slice(-6)}`
            };
            
            // Ouvrir le PDF dans un nouvel onglet
            if (window.downloadPdf) {
                window.downloadPdf('enseignants/Modèle PAI Tunisien.pdf');
            }
            
            // Animation de succès
            this.innerHTML = '<i class="fas fa-check"></i> PAI Généré !';
            this.style.background = 'var(--pastel-green)';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-magic"></i> Générer le PAI PDF';
                this.style.background = '';
            }, 2000);
            
            showNotification(`PAI pour ${paiData.eleve} généré avec succès`);
        });
    }

    // ========== CHECKLIST INTERACTIVE ==========
    const checklistItems = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    const checklistProgress = document.getElementById('checklistProgress');
    const saveChecklistBtn = document.getElementById('saveChecklist');
    
    if (checklistItems.length > 0) {
        checklistItems.forEach(item => {
            item.addEventListener('change', updateChecklistProgress);
        });
    }
    
    function updateChecklistProgress() {
        const total = checklistItems.length;
        const checked = Array.from(checklistItems).filter(item => item.checked).length;
        const percentage = Math.round((checked / total) * 100);
        
        if (checklistProgress) {
            checklistProgress.style.width = `${percentage}%`;
            
            const progressText = document.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${percentage}% complété`;
                
                // Changer la couleur en fonction du progrès
                if (percentage === 100) {
                    checklistProgress.style.background = 'var(--pastel-green)';
                    progressText.style.color = 'var(--pastel-teal)';
                } else if (percentage >= 50) {
                    checklistProgress.style.background = 'var(--gradient-accent)';
                } else {
                    checklistProgress.style.background = 'var(--gradient-primary)';
                }
            }
        }
    }
    
    if (saveChecklistBtn) {
        saveChecklistBtn.addEventListener('click', function() {
            if (window.downloadPdf) {
                window.downloadPdf('enseignants/CHECKLIST INTERACTIVE.pdf');
            }
            this.innerHTML = '<i class="fas fa-check"></i> Checklist Exportée !';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-file-export"></i> Exporter en PDF';
            }, 2000);
        });
    }

    // ========== QUIZ INTERACTIF ==========
    const quizOptions = document.querySelectorAll('.quiz-option input[type="radio"]');
    const submitQuizBtn = document.getElementById('submitQuiz');
    const nextQuizBtn = document.getElementById('nextQuiz');
    const restartQuizBtn = document.getElementById('restartQuiz');
    
    const quizQuestionTitles = [
        "Quelle est la première chose à faire lors d'une crise convulsive ?",
        "Question 2/3 : Quel est le bon comportement à adopter lors d'une crise ?",
        "Question 3/3 : Que faire après une crise convulsive ?"
    ];
    
    let currentQuestion = 1;
    const correctAnswers = {
        quiz1: 'B'  // La bonne réponse pour la question 1
    };
    
    function resetQuizUI() {
        quizOptions.forEach(option => {
            option.checked = false;
            option.disabled = false;
            const optionContent = option.parentElement;
            optionContent.style.borderColor = '';
            optionContent.style.background = '';
        });
        const questionElement = document.querySelector('.quiz-question h4');
        if (questionElement) questionElement.textContent = quizQuestionTitles[0];
        if (submitQuizBtn) {
            submitQuizBtn.disabled = false;
            submitQuizBtn.style.display = 'flex';
        }
        if (nextQuizBtn) nextQuizBtn.style.display = 'none';
        if (restartQuizBtn) restartQuizBtn.style.display = 'none';
    }
    
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', function() {
            const selectedOption = document.querySelector('input[name="quiz1"]:checked');
            
            if (!selectedOption) {
                showNotification('Veuillez sélectionner une réponse', 'warning');
                return;
            }
            
            const questionName = selectedOption.name;
            const userAnswer = selectedOption.value;
            const isCorrect = correctAnswers[questionName] === userAnswer;
            
            // Appliquer le style de réponse
            quizOptions.forEach(option => {
                const optionContent = option.parentElement;
                if (option.value === correctAnswers[questionName]) {
                    optionContent.style.borderColor = 'var(--pastel-green)';
                    optionContent.style.background = 'rgba(212, 244, 221, 0.3)';
                } else if (option.checked && !isCorrect) {
                    optionContent.style.borderColor = 'var(--pastel-blush)';
                    optionContent.style.background = 'rgba(255, 154, 162, 0.1)';
                }
            });
            
            // Désactiver les options
            quizOptions.forEach(option => {
                option.disabled = true;
            });
            
            // Mettre à jour le score
            if (isCorrect) {
                quizScore++;
                showNotification('Bonne réponse !', 'success');
            } else {
                showNotification('La bonne réponse était B', 'info');
            }
            
            this.disabled = true;
            // À la question 3/3 : afficher Recommencer, sinon Question suivante
            if (currentQuestion === 3) {
                if (restartQuizBtn) restartQuizBtn.style.display = 'flex';
                showNotification(`Quiz terminé ! Score : ${quizScore}/3`, 'success');
            } else {
                if (nextQuizBtn) nextQuizBtn.style.display = 'flex';
            }
        });
    }
    
    if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', function() {
            // Réinitialiser pour la prochaine question
            quizOptions.forEach(option => {
                option.checked = false;
                option.disabled = false;
                const optionContent = option.parentElement;
                optionContent.style.borderColor = '';
                optionContent.style.background = '';
            });
            
            submitQuizBtn.disabled = false;
            this.style.display = 'none';
            currentQuestion++;
            
            // Mettre à jour l'affichage de la question
            const questionElement = document.querySelector('.quiz-question h4');
            if (questionElement && currentQuestion <= 3) {
                questionElement.textContent = quizQuestionTitles[currentQuestion - 1] || `Question ${currentQuestion}/3 : Quel est le bon comportement à adopter...`;
            }
        });
    }
    
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', function() {
            currentQuestion = 1;
            quizScore = 0;
            resetQuizUI();
            showNotification('Quiz réinitialisé. Bonne chance !', 'info');
        });
    }

    // ========== ATTESTATION PERSONNALISÉE ==========
    const inputName = document.getElementById('inputName');
    const previewNameBtn = document.getElementById('previewNameBtn');
    const userName = document.getElementById('userName');
    const downloadCertBtn = document.getElementById('downloadCert');
    const currentDate = document.getElementById('currentDate');
    const certNumber = document.getElementById('certNumber');
    
    // Initialiser la date et le numéro
    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('fr-FR');
    }
    
    if (certNumber) {
        certNumber.textContent = Math.floor(10000 + Math.random() * 90000);
    }
    
    if (previewNameBtn) {
        previewNameBtn.addEventListener('click', function() {
            const name = inputName.value.trim();
            if (!name) {
                showNotification('Veuillez saisir votre nom', 'warning');
                return;
            }
            
            if (userName) userName.textContent = name;
            if (previewName) previewName.textContent = name;
            
            // Animation
            inputName.style.borderColor = 'var(--pastel-green)';
            setTimeout(() => {
                inputName.style.borderColor = '';
            }, 2000);
            
            showNotification('Nom mis à jour dans l\'attestation');
        });
    }
    
    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', function() {
            if (!inputName.value.trim()) {
                showNotification('Veuillez personnaliser votre nom avant de télécharger', 'warning');
                inputName.focus();
                return;
            }
            if (window.downloadPdf) {
                window.downloadPdf('enseignants/Attestation d\'Aptitude à l\'Inclusion.pdf');
            }
            this.innerHTML = '<i class="fas fa-check"></i> Attestation Téléchargée !';
            this.style.background = 'var(--pastel-green)';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-download"></i> Télécharger l\'Attestation PDF';
                this.style.background = '';
            }, 2000);
         });
    }

    // ========== MODAL D'APERÇU ==========
    const previewButtons = document.querySelectorAll('.btn-preview');
    const previewModal = document.getElementById('previewModal');
    const modalClose = document.getElementById('modalClose');
    const closePreview = document.getElementById('closePreview');
    const downloadFromModal = document.getElementById('downloadFromModal');
    
    let currentPreviewFile = '';
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.module-card, .ressource-card');
            const title = card ? card.querySelector('h3, h4').textContent : 'Document';
            const description = card ? card.querySelector('.module-description, p').textContent : 'Description du document';
            currentPreviewFile = this.getAttribute('data-file') || this.closest('[data-file]')?.getAttribute('data-file') || 'document.pdf';
            
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDescription').textContent = description;
            
            if (previewModal) {
                previewModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    function closeModal() {
        if (previewModal) {
            previewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (closePreview) closePreview.addEventListener('click', closeModal);
    
    // Fermer la modal en cliquant en dehors
    if (previewModal) {
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    
    if (downloadFromModal) {
        downloadFromModal.addEventListener('click', function() {
            simulateDownload(currentPreviewFile);
            closeModal();
        });
    }

    // ========== BOUTON RETOUR EN HAUT ==========
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(20px)';
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

    // ========== ANIMATIONS AU SCROLL ==========
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.module-card, .ressource-card, .outil-card, .testimonial-card');
        
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
    document.querySelectorAll('.module-card, .ressource-card, .outil-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Déclencher une fois au chargement
    setTimeout(animateOnScroll, 100);

    // ========== SWIPER CAROUSEL ==========
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            autoHeight: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: true,
        });
    }

    // ========== FONCTIONS UTILITAIRES ==========
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
            border-left: 4px solid ${type === 'success' ? 'var(--pastel-green)' : type === 'warning' ? 'var(--pastel-coral)' : 'var(--pastel-blue)'};
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
        // Ajouter les animations CSS
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function updateDateTime() {
        const now = new Date();
        const dateTimeElements = document.querySelectorAll('#currentDate, #previewDate');
        
        dateTimeElements.forEach(el => {
            if (el.id === 'currentDate') {
                el.textContent = now.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } else if (el.id === 'previewDate') {
                el.textContent = now.toLocaleDateString('fr-FR');
            }
        });
    }
    
    // Mettre à jour la date toutes les minutes
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // ========== ÉVÉNEMENTS AU CHARGEMENT ==========
    // Initialiser la checklist
    updateChecklistProgress();
    
    // Initialiser l'aperçu PAI
    updatePaiPreview();
    
    // Animation d'entrée globale
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    // Style initial du body pour l'animation d'entrée
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    document.body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    console.log('Espace Enseignant chargé avec succès !');
});