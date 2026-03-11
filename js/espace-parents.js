// Configuration initiale
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser Swiper carousel
    const swiper = new Swiper('.symptoms-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    });

    // Initialiser le graphique
    initializeChart();

    // Gestion des événements
    setupEventListeners();
    
    // Initialiser le quiz
    initializeQuiz();
    
    // Back to top
    setupBackToTop();
    
    // Menu mobile
    setupMobileMenu();
});

// Graphique des types de crises
function initializeChart() {
    const ctx = document.getElementById('crisesChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Focales', 'Généralisées', 'Absences'],
            datasets: [{
                data: [60, 30, 10],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Gestion des événements
function setupEventListeners() {
    // Boutons d'information des crises
    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.target;
            showCriseInfo(type);
        });
    });

    // Boutons play vidéo
    document.querySelectorAll('.play-btn, .play-overlay').forEach(btn => {
        btn.addEventListener('click', function() {
            const videoUrl = this.dataset.video || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            openVideoModal(videoUrl);
        });
    });

    // Étapes d'urgence interactives
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.querySelector('.prev-step');
    const nextBtn = document.querySelector('.next-step');
    let currentStep = 0;

    function updateSteps() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        prevBtn.disabled = currentStep === 0;
        nextBtn.disabled = currentStep === steps.length - 1;
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateSteps();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateSteps();
        }
    });

    // FAQ accordéon
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            item.classList.toggle('active');
        });
    });

    // Téléchargement des fiches
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            simulateDownload(this.closest('.fiche').querySelector('h4').textContent);
        });
    });

    // Fermer modal vidéo
    document.querySelector('.modal-close').addEventListener('click', closeVideoModal);
    document.querySelector('.modal').addEventListener('click', function(e) {
        if (e.target === this) closeVideoModal();
    });
}

// Informations détaillées sur les crises
function showCriseInfo(type) {
    const infos = {
        focale: {
            title: "Crises Focales",
            description: "Touchant une zone précise du cerveau. Les symptômes varient selon la zone touchée.",
            symptoms: ["Mouvements localisés", "Sensations étranges", "Troubles du langage", "Conscience préservée ou altérée"],
            advice: "Notez précisément les symptômes pour aider au diagnostic."
        },
        generalisee: {
            title: "Crises Généralisées",
            description: "Touchant l'ensemble du cerveau. Les crises tonicocloniques sont les plus connues.",
            symptoms: ["Perte de conscience", "Raideur musculaire", "Secousses rythmées", "Chute brutale"],
            advice: "Protéger la tête, ne pas contraindre, chronométrer la crise."
        },
        absence: {
            title: "Absences",
            description: "Pertes de conscience brèves, souvent chez l'enfant. Peuvent passer inaperçues.",
            symptoms: ["Regard fixe", "Interruption d'activité", "Clignement des yeux", "Retour immédiat à la normale"],
            advice: "Souvent confondues avec de la distraction. Filmer l'épisode peut aider au diagnostic."
        }
    };

    const info = infos[type];
    if (!info) return;

    // Créer une modal d'information
    const modal = document.createElement('div');
    modal.className = 'crise-modal';
    modal.innerHTML = `
        <div class="crise-modal-content">
            <h3>${info.title}</h3>
            <p>${info.description}</p>
            <h4>Symptômes courants :</h4>
            <ul>
                ${info.symptoms.map(s => `<li>${s}</li>`).join('')}
            </ul>
            <div class="crise-advice">
                <i class="fas fa-lightbulb"></i>
                <p>${info.advice}</p>
            </div>
            <button class="close-crise-modal">Fermer</button>
        </div>
    `;

    // Style de la modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    modal.querySelector('.crise-modal-content').style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        animation: appear 0.3s ease;
    `;

    modal.querySelector('.close-crise-modal').style.cssText = `
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 50px;
        cursor: pointer;
        margin-top: 1rem;
    `;

    document.body.appendChild(modal);

    // Fermer la modal
    modal.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('close-crise-modal')) {
            this.remove();
        }
    });
}

// Modal vidéo (MP4 local ou YouTube iframe)
function openVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframePlayer = document.getElementById('videoPlayer');
    const videoPlayerLocal = document.getElementById('videoPlayerLocal');
    const isLocalVideo = videoUrl && (videoUrl.indexOf('.mp4') !== -1 || videoUrl.indexOf('.webm') !== -1);

    if (isLocalVideo && videoPlayerLocal) {
        videoPlayerLocal.style.display = 'block';
        videoPlayerLocal.src = videoUrl;
        videoPlayerLocal.play();
        if (iframePlayer) iframePlayer.style.display = 'none';
    } else if (iframePlayer) {
        iframePlayer.style.display = 'block';
        iframePlayer.src = videoUrl;
        if (videoPlayerLocal) {
            videoPlayerLocal.pause();
            videoPlayerLocal.src = '';
            videoPlayerLocal.style.display = 'none';
        }
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframePlayer = document.getElementById('videoPlayer');
    const videoPlayerLocal = document.getElementById('videoPlayerLocal');

    if (iframePlayer) {
        iframePlayer.src = '';
    }
    if (videoPlayerLocal) {
        videoPlayerLocal.pause();
        videoPlayerLocal.src = '';
        videoPlayerLocal.style.display = 'none';
    }
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Simuler téléchargement
function simulateDownload(filename) {
    const toast = document.createElement('div');
    toast.className = 'download-toast';
    toast.textContent = `Téléchargement de "${filename}" en cours...`;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        animation: slideIn 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Système de quiz
function initializeQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    const totalQuestions = questions.length;
    const progressFill = document.getElementById('quizProgress');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const nextBtn = document.getElementById('nextQuestion');
    const prevBtn = document.getElementById('prevQuestion');
    const submitBtn = document.getElementById('submitQuiz');
    const retryBtn = document.getElementById('retryQuiz');
    const shareBtn = document.getElementById('shareResults');
    const resultsDiv = document.getElementById('quizResults');
    const scoreCircle = document.getElementById('score-circle');
    const finalScore = document.getElementById('finalScore');
    const scoreMessage = document.getElementById('scoreMessage');
    
    let currentQuestion = 0;
    let userAnswers = new Array(totalQuestions).fill(null);
    let quizCompleted = false;
    
    totalQuestionsSpan.textContent = totalQuestions;
    
    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.classList.toggle('active', i === index);
        });
        
        currentQuestionSpan.textContent = index + 1;
        progressFill.style.width = `${((index + 1) / totalQuestions) * 100}%`;
        
        // Réinitialiser les sélections visuelles
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Restaurer la sélection précédente si elle existe
        if (userAnswers[index] !== null) {
            const selectedOpt = questions[index].querySelectorAll('.quiz-option')[userAnswers[index]];
            if (selectedOpt) {
                selectedOpt.classList.add('selected');
            }
        }
        
        // Gérer la visibilité des boutons
        prevBtn.style.display = index === 0 ? 'none' : 'flex';
        nextBtn.style.display = index === totalQuestions - 1 ? 'none' : 'flex';
        submitBtn.style.display = index === totalQuestions - 1 ? 'flex' : 'none';
        
        // Si le quiz est terminé, montrer les résultats
        if (quizCompleted) {
            showResults();
        }
    }
    
    function selectAnswer(questionIndex, optionIndex) {
        if (quizCompleted) return;
        
        userAnswers[questionIndex] = optionIndex;
        
        // Mettre à jour l'apparence de l'option sélectionnée
        const options = questions[questionIndex].querySelectorAll('.quiz-option');
        options.forEach((opt, i) => {
            opt.classList.remove('selected');
            if (i === optionIndex) {
                opt.classList.add('selected');
            }
        });
    }
    
    function showResults() {
        // Calculer le score
        let score = 0;
        questions.forEach((question, qIndex) => {
            const selectedIndex = userAnswers[qIndex];
            if (selectedIndex !== null) {
                const selectedOption = question.querySelectorAll('.quiz-option')[selectedIndex];
                const isCorrect = selectedOption.dataset.correct === 'true';
                
                if (isCorrect) {
                    score++;
                    
                    // Marquer comme correct
                    selectedOption.classList.add('correct');
                } else {
                    // Marquer comme incorrect et montrer la bonne réponse
                    selectedOption.classList.add('incorrect');
                    
                    // Trouver et marquer la bonne réponse
                    const correctOption = Array.from(question.querySelectorAll('.quiz-option'))
                        .find(opt => opt.dataset.correct === 'true');
                    if (correctOption) {
                        correctOption.classList.add('correct');
                    }
                }
            }
        });
        
        const percentage = Math.round((score / totalQuestions) * 100);
        finalScore.textContent = percentage;
        
        // Animer le cercle de score
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (percentage / 100) * circumference;
        scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        scoreCircle.style.strokeDashoffset = offset;
        
        // Message selon le score
        if (percentage >= 80) {
            scoreMessage.textContent = "Excellent ! Vous maîtrisez parfaitement le sujet.";
        } else if (percentage >= 60) {
            scoreMessage.textContent = "Bon score ! Vous avez de bonnes connaissances.";
        } else if (percentage >= 40) {
            scoreMessage.textContent = "Score moyen. Continuez à vous informer.";
        } else {
            scoreMessage.textContent = "À revoir. Explorez les ressources pour en savoir plus.";
        }
        
        // Afficher les résultats
        document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
        resultsDiv.style.display = 'block';
        quizCompleted = true;
    }
    
    // Événements du quiz
    document.querySelectorAll('.quiz-option').forEach((option, index) => {
        option.addEventListener('click', function() {
            const questionIndex = Array.from(questions).findIndex(q => 
                q.contains(this) && q.classList.contains('active')
            );
            
            if (questionIndex !== -1) {
                const optionIndex = Array.from(this.parentElement.children).indexOf(this);
                selectAnswer(questionIndex, optionIndex);
            }
        });
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentQuestion < totalQuestions - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
    
    submitBtn.addEventListener('click', () => {
        // Vérifier si toutes les questions sont répondues
        const allAnswered = userAnswers.every(answer => answer !== null);
        
        if (!allAnswered) {
            alert('Veuillez répondre à toutes les questions avant de terminer.');
            return;
        }
        
        showResults();
    });
    
    retryBtn.addEventListener('click', () => {
        // Réinitialiser le quiz
        currentQuestion = 0;
        userAnswers.fill(null);
        quizCompleted = false;
        resultsDiv.style.display = 'none';
        
        // Réinitialiser l'apparence des options
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        showQuestion(0);
    });
    
    shareBtn.addEventListener('click', () => {
        const score = parseInt(finalScore.textContent);
        const message = `J'ai obtenu ${score}% au quiz sur l'épilepsie ! Testez vos connaissances sur epilepsie-ecole.fr`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mon score au quiz Épilepsie',
                text: message,
                url: window.location.href
            });
        } else {
            // Fallback pour copier dans le presse-papier
            navigator.clipboard.writeText(message).then(() => {
                alert('Résultats copiés dans le presse-papier !');
            });
        }
    });
    
    // Initialiser avec la première question
    showQuestion(0);
}

// Back to top
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        }
    });
    
    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
}

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.crise-type, .fiche, .video-item, .association, .faq-item').forEach(el => {
    observer.observe(el);
});

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes appear {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .download-toast {
        animation: slideIn 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .nav-links.active {
            display: flex;
        }
    }
`;
document.head.appendChild(style);