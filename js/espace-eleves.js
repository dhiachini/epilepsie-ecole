// ============================================
// COIN ÉLÈVES - SCRIPT PRINCIPAL
// ============================================

// Variables globales
let currentSection = 'welcome';
let gameInterval = null;
let stormCount = 0;
let calmCount = 0;
let protectionScore = 100;
let empathyScore = 0;
let currentChapter = 1;
let currentQuestion = 0;
let quizScore = 0;
let selectedMessageParts = [];

// Données de l'histoire
const storyChapters = [
    {
        id: 1,
        title: "Une Nouvelle Rencontre",
        characters: ["leo", "chloe"],
        illustration: "school-scene",
        content: `
            <p>C'était un beau jour de septembre. Dans la cour de l'école, Léo rencontra Chloé pour la première fois. Ils partagèrent leurs goûts pour les dinosaures et le football.</p>
            <p>Léo expliqua à Chloé qu'il avait de l'épilepsie. "C'est comme si mon cerveau faisait parfois une fête sans prévenir !" dit-il en souriant.</p>
            <p>Chloé écouta attentivement, un peu inquiète mais surtout curieuse. Elle voulait comprendre pour pouvoir aider son nouveau copain.</p>
        `
    },
    {
        id: 2,
        title: "La Première Crise",
        characters: ["leo", "chloe", "tom"],
        illustration: "classroom-scene",
        content: `
            <p>Un jeudi après-midi, pendant un cours de dessin, Léo s'est mis à regarder dans le vide. Son crayon est tombé de sa main.</p>
            <p>Chloé, assise à côté de lui, a remarqué qu'il ne répondait pas quand elle l'appelait. Elle a tout de suite prévenu la maîtresse.</p>
            <p>Tom, un autre camarade, a aidé à éloigner les tables pour que Léo ne se blesse pas. La maîtresse a mis Léo en position latérale de sécurité.</p>
            <p>Quelques minutes plus tard, Léo a recommencé à bouger. Il était fatigué et un peu confus, mais il allait bien.</p>
        `
    },
    {
        id: 3,
        title: "Les Explications",
        characters: ["leo", "chloe", "tom"],
        illustration: "explanation-scene",
        content: `
            <p>Le lendemain, la maîtresse a expliqué à toute la classe ce qu'était l'épilepsie. Elle a utilisé des dessins pour montrer comment fonctionne le cerveau.</p>
            <p>Léo a partagé son expérience : "Parfois, mon cerveau envoie trop de signaux électriques en même temps. C'est comme un orage dans ma tête !"</p>
            <p>Chloé a demandé : "Est-ce que ça fait mal ?" Léo a répondu : "Non, pas du tout ! Mais après, je suis souvent très fatigué."</p>
            <p>Tom a ajouté : "Maintenant nous savons comment t'aider si ça arrive encore !"</p>
        `
    },
    {
        id: 4,
        title: "Une Super Équipe",
        characters: ["leo", "chloe", "tom"],
        illustration: "friendship-scene",
        content: `
            <p>Depuis ce jour, Léo, Chloé et Tom sont devenus des amis inséparables. Ils ont créé un système pour aider Léo.</p>
            <p>Chloé vérifie que Léo prend bien ses médicaments à la cantine. Tom s'assure qu'il n'y a pas de lumières clignotantes quand ils jouent aux jeux vidéo.</p>
            <p>Léo leur a appris les signes qui montrent qu'une crise pourrait arriver : "Quand je suis très fatigué ou stressé, c'est plus probable."</p>
            <p>Avec ses amis à ses côtés, Léo se sent en sécurité et compris. Il sait qu'il peut compter sur eux !</p>
        `
    }
];

// Données du quiz
const quizQuestions = [
    {
        question: "L'épilepsie est contagieuse (on peut l'attraper comme un rhume).",
        options: [
            { text: "Vrai", correct: false, feedback: "Faux ! L'épilepsie n'est PAS contagieuse. C'est une condition neurologique, pas une maladie infectieuse." },
            { text: "Faux", correct: true, feedback: "Exact ! On ne peut pas attraper l'épilepsie comme un rhume ou une grippe." }
        ]
    },
    {
        question: "Que faut-il faire si un ami fait une crise d'épilepsie ?",
        options: [
            { text: "Mettre un objet dans sa bouche", correct: false, feedback: "Non ! Il ne faut jamais mettre quoi que ce soit dans la bouche pendant une crise." },
            { text: "Le maintenir pour l'empêcher de bouger", correct: false, feedback: "Non ! Il ne faut pas empêcher les mouvements, sauf si la personne risque de se blesser." },
            { text: "Protéger sa tête et appeler un adulte", correct: true, feedback: "Parfait ! Protéger la tête et appeler un adulte sont les bonnes réactions." },
            { text: "Lui donner à boire immédiatement", correct: false, feedback: "Non ! Il faut attendre que la crise soit complètement terminée." }
        ]
    },
    {
        question: "Une personne avec de l'épilepsie peut-elle faire du sport ?",
        options: [
            { text: "Non, c'est trop dangereux", correct: false, feedback: "Non ! La plupart des sports sont possibles avec quelques précautions." },
            { text: "Oui, comme tout le monde, avec certaines précautions", correct: true, feedback: "Exact ! L'activité physique est même recommandée pour la santé." },
            { text: "Seulement la natation", correct: false, feedback: "Non ! Beaucoup de sports sont possibles, pas seulement la natation." },
            { text: "Uniquement des sports calmes", correct: false, feedback: "Non ! Même des sports plus actifs sont possibles." }
        ]
    },
    {
        question: "Comment réagir après une crise ?",
        options: [
            { text: "Lui poser plein de questions", correct: false, feedback: "Non ! La personne est souvent fatiguée et confuse après une crise." },
            { text: "Lui laisser du temps pour se reposer", correct: true, feedback: "Très bien ! Le repos est important après une crise." },
            { text: "Faire comme si rien ne s'était passé", correct: false, feedback: "Non ! Il faut montrer qu'on est là pour aider." },
            { text: "Raconter la crise en détail", correct: false, feedback: "Non ! Cela pourrait gêner la personne." }
        ]
    },
    {
        question: "Qu'est-ce qui peut déclencher une crise ?",
        options: [
            { text: "Le stress ou la fatigue", correct: true, feedback: "Oui ! Le stress et la fatigue sont des déclencheurs communs." },
            { text: "Manger trop de bonbons", correct: false, feedback: "Non ! Les bonbons ne déclenchent pas de crises, mais une alimentation équilibrée est importante." },
            { text: "Regarder la télévision normalement", correct: false, feedback: "Non ! Seules les lumières clignotantes peuvent être problématiques." },
            { text: "Jouer avec des amis", correct: false, feedback: "Non ! Jouer est bon pour tout le monde !" }
        ]
    }
];

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Coin Élèves - Initialisation...');
    
    // Initialiser toutes les fonctionnalités
    initNavigation();
    initStory();
    initGame();
    initEmpathyExercises();
    initQuiz();
    initCharacterInteractions();
    initVideoPlaceholder();
    
    // Afficher la section d'accueil
    showSection('welcome');
    
    // Initialiser les compteurs
    updateGameStats();
    updateEmpathyProgress();
});

// ============================================
// NAVIGATION ENTRE SECTIONS
// ============================================

function initNavigation() {
    // Navigation principale
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Mettre à jour l'état actif
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Boutons CTA de l'accueil
    const storyBtn = document.querySelector('.story-btn');
    const gameBtn = document.querySelector('.game-btn');
    
    if (storyBtn) {
        storyBtn.addEventListener('click', function() {
            showSection('story');
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-section') === 'story') {
                    btn.classList.add('active');
                }
            });
        });
    }
    
    if (gameBtn) {
        gameBtn.addEventListener('click', function() {
            showSection('game');
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-section') === 'game') {
                    btn.classList.add('active');
                }
            });
        });
    }
    
    // Liens du footer
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Mettre à jour la navigation
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-section') === sectionId) {
                    btn.classList.add('active');
                }
            });
        });
    });
}

function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Actions spécifiques selon la section
        switch(sectionId) {
            case 'story':
                loadChapter(currentChapter);
                break;
            case 'quiz':
                loadQuestion(currentQuestion);
                break;
            case 'game':
                resetBrainAnimation();
                break;
        }
    }
}

// ============================================
// HISTOIRE INTERACTIVE
// ============================================

function initStory() {
    // Navigation entre chapitres
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentChapter > 1) {
                currentChapter--;
                loadChapter(currentChapter);
                updateProgressSteps();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentChapter < storyChapters.length) {
                currentChapter++;
                loadChapter(currentChapter);
                updateProgressSteps();
            }
        });
    }
    
    // Clic sur les étapes de progression
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const chapterNum = parseInt(this.getAttribute('data-chapter'));
            if (chapterNum && chapterNum !== currentChapter) {
                currentChapter = chapterNum;
                loadChapter(currentChapter);
                updateProgressSteps();
            }
        });
    });
}

function loadChapter(chapterNum) {
    const chapter = storyChapters[chapterNum - 1];
    if (!chapter) return;
    
    // Mettre à jour le contenu du chapitre
    const chapterElement = document.getElementById('chapter-1');
    if (chapterElement) {
        // Mettre à jour le titre
        const header = chapterElement.querySelector('.chapter-header h3');
        if (header) {
            header.textContent = `Chapitre ${chapterNum} : ${chapter.title}`;
        }
        
        // Mettre à jour les personnages
        const charactersContainer = chapterElement.querySelector('.chapter-characters');
        if (charactersContainer) {
            charactersContainer.innerHTML = '';
            chapter.characters.forEach(char => {
                const badge = document.createElement('span');
                badge.className = `character-badge ${char}`;
                badge.textContent = char.charAt(0).toUpperCase() + char.slice(1);
                charactersContainer.appendChild(badge);
            });
        }
        
        // Mettre à jour le texte
        const textContainer = chapterElement.querySelector('.story-text');
        if (textContainer) {
            textContainer.innerHTML = chapter.content;
        }
        
        // Mettre à jour l'illustration
        const illustration = chapterElement.querySelector('.scene');
        if (illustration) {
            illustration.className = `scene ${chapter.illustration}`;
            
            // Générer l'illustration selon le chapitre
            generateStoryIllustration(chapterNum, illustration);
        }
    }
    
    // Mettre à jour les boutons de navigation
    updateStoryNavigation();
}

function generateStoryIllustration(chapterNum, container) {
    // Nettoyer le conteneur
    container.innerHTML = '';
    
    switch(chapterNum) {
        case 1: // École
            container.innerHTML = `
                <div class="school">🏫</div>
                <div class="character-avatar leo-avatar" style="left: 30px;">👦</div>
                <div class="character-avatar chloe-avatar" style="right: 30px;">👧</div>
                <div class="speech-bubble leo-speech">Bonjour, je m'appelle Léo !</div>
                <div class="speech-bubble chloe-speech">Enchantée, moi c'est Chloé !</div>
            `;
            break;
            
        case 2: // Classe
            container.innerHTML = `
                <div class="classroom">🏫</div>
                <div class="character-avatar leo-avatar" style="left: 50%; transform: translateX(-50%);">👦</div>
                <div class="character-avatar chloe-avatar" style="left: 30px; top: 150px;">👧</div>
                <div class="character-avatar tom-avatar" style="right: 30px; top: 150px;">👦</div>
                <div class="teacher-avatar" style="left: 50%; top: 30px; transform: translateX(-50%);">👩‍🏫</div>
                <div class="speech-bubble chloe-speech" style="top: 120px; left: 30px;">Maîtresse !</div>
            `;
            break;
            
        case 3: // Explication
            container.innerHTML = `
                <div class="classroom">🏫</div>
                <div class="character-avatar leo-avatar" style="left: 30px;">👦</div>
                <div class="character-avatar chloe-avatar" style="left: 150px;">👧</div>
                <div class="character-avatar tom-avatar" style="left: 270px;">👦</div>
                <div class="brain-model" style="left: 50%; top: 100px; transform: translateX(-50%); font-size: 4rem;">🧠</div>
                <div class="speech-bubble leo-speech" style="top: 200px; left: 30px;">Mon cerveau fait des orages !</div>
            `;
            break;
            
        case 4: // Amitié
            container.innerHTML = `
                <div class="park">🌳</div>
                <div class="character-avatar leo-avatar" style="left: 100px;">👦</div>
                <div class="character-avatar chloe-avatar" style="left: 200px;">👧</div>
                <div class="character-avatar tom-avatar" style="left: 300px;">👦</div>
                <div class="friendship-heart" style="left: 50%; top: 50px; transform: translateX(-50%); font-size: 3rem;">❤️</div>
                <div class="speech-bubble chloe-speech" style="top: 150px; left: 100px;">On est là pour toi !</div>
            `;
            break;
    }
    
    // Animer les éléments
    setTimeout(() => {
        const avatars = container.querySelectorAll('.character-avatar');
        avatars.forEach(avatar => {
            avatar.style.animation = 'bounce 2s infinite';
        });
        
        const speechBubbles = container.querySelectorAll('.speech-bubble');
        speechBubbles.forEach(bubble => {
            bubble.style.animation = 'speak 2s infinite';
        });
    }, 100);
}

function updateStoryNavigation() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentChapter === 1;
        prevBtn.style.opacity = currentChapter === 1 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentChapter === storyChapters.length;
        nextBtn.innerHTML = currentChapter === storyChapters.length ? 
            'Fin de l\'histoire <i class="fas fa-flag-checkered"></i>' : 
            'Suivant <i class="fas fa-arrow-right"></i>';
        nextBtn.style.opacity = currentChapter === storyChapters.length ? '0.5' : '1';
    }
}

function updateProgressSteps() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum === currentChapter) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ============================================
// JEU DU CERVEAU
// ============================================

function initGame() {
    // Boutons d'action
    const actionButtons = document.querySelectorAll('.game-action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleGameAction(action);
        });
    });
    
    // Initialiser l'affichage du cerveau
    initBrainDisplay();
}

function initBrainDisplay() {
    const brainDisplay = document.getElementById('brain-display');
    if (!brainDisplay) return;
    
    // Créer des cellules cérébrales
    for (let i = 0; i < 30; i++) {
        const cell = document.createElement('div');
        cell.className = 'brain-cell';
        cell.style.cssText = `
            position: absolute;
            width: ${Math.random() * 15 + 10}px;
            height: ${Math.random() * 15 + 10}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkle ${Math.random() * 3 + 2}s infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        brainDisplay.appendChild(cell);
    }
}

function handleGameAction(action) {
    const brainDisplay = document.getElementById('brain-display');
    const statusText = document.getElementById('brain-status-text');
    const energyBar = document.querySelector('.energy-bar');
    const energyValue = document.querySelector('.energy-value');
    
    if (!brainDisplay || !statusText) return;
    
    // Effets selon l'action
    switch(action) {
        case 'stress':
        case 'fatigue':
        case 'lumiere':
            // Déclencher une tempête
            triggerBrainStorm();
            protectionScore = Math.max(0, protectionScore - 15);
            stormCount++;
            statusText.textContent = "Tempête cérébrale !";
            statusText.style.color = "var(--danger)";
            break;
            
        case 'calme':
        case 'medicament':
        case 'repos':
            // Calmer le cerveau
            calmBrainStorm();
            protectionScore = Math.min(100, protectionScore + 20);
            calmCount++;
            empathyScore += 5;
            statusText.textContent = "Cerveau apaisé";
            statusText.style.color = "var(--success)";
            break;
    }
    
    // Mettre à jour l'affichage
    updateGameStats();
    updateEmpathyProgress();
    
    // Mettre à jour la barre d'énergie
    if (energyBar && energyValue) {
        energyBar.style.width = `${protectionScore}%`;
        energyValue.textContent = `${protectionScore}%`;
        
        // Changer la couleur selon le niveau
        if (protectionScore > 70) {
            energyBar.style.background = "linear-gradient(90deg, #4CAF50, #66BB6A)";
        } else if (protectionScore > 30) {
            energyBar.style.background = "linear-gradient(90deg, #FFC107, #FFB300)";
        } else {
            energyBar.style.background = "linear-gradient(90deg, #FF5252, #FF6B6B)";
        }
    }
}

function triggerBrainStorm() {
    const brainDisplay = document.getElementById('brain-display');
    const cells = brainDisplay.querySelectorAll('.brain-cell');
    
    // Animation de tempête
    brainDisplay.style.animation = 'storm 0.5s ease-in-out';
    brainDisplay.style.background = 'linear-gradient(135deg, #FF5252, #FF6B6B)';
    
    // Animer les cellules
    cells.forEach(cell => {
        cell.style.background = `rgba(255, 255, 0, ${Math.random() * 0.7 + 0.3})`;
        cell.style.animation = `sparkle ${Math.random() * 0.5 + 0.2}s infinite`;
        cell.style.transform = `scale(${Math.random() * 0.5 + 1})`;
    });
    
    // Arrêter l'animation après un moment
    setTimeout(() => {
        brainDisplay.style.animation = '';
    }, 500);
}

function calmBrainStorm() {
    const brainDisplay = document.getElementById('brain-display');
    const cells = brainDisplay.querySelectorAll('.brain-cell');
    
    // Animation de calme
    brainDisplay.style.animation = 'calm 2s ease-in-out';
    brainDisplay.style.background = 'linear-gradient(135deg, #6C8EF5, #A855F7)';
    
    // Ramener les cellules à la normale
    cells.forEach(cell => {
        cell.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
        cell.style.animation = `sparkle ${Math.random() * 3 + 2}s infinite`;
        cell.style.transform = 'scale(1)';
    });
}

function resetBrainAnimation() {
    const brainDisplay = document.getElementById('brain-display');
    if (brainDisplay) {
        brainDisplay.style.animation = '';
        brainDisplay.style.background = 'linear-gradient(135deg, #6C8EF5, #A855F7)';
    }
}

function updateGameStats() {
    // Mettre à jour les compteurs
    const stormElement = document.getElementById('storm-count');
    const protectionElement = document.getElementById('protection-score');
    const empathyElement = document.getElementById('empathy-score');
    
    if (stormElement) stormElement.textContent = stormCount;
    if (protectionElement) protectionElement.textContent = protectionScore;
    if (empathyElement) empathyElement.textContent = empathyScore;
}

// ============================================
// EXERCICES D'EMPATHIE
// ============================================

function initEmpathyExercises() {
    // Exercice 1 : Jeu des émotions
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    emotionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const emotion = this.getAttribute('data-emotion');
            handleEmotionChoice(emotion, this);
        });
    });
    
    // Exercice 2 : Que faire ?
    const reactionButtons = document.querySelectorAll('.reaction-btn');
    reactionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isCorrect = this.classList.contains('correct');
            handleReactionChoice(isCorrect, this);
        });
    });
    
    // Exercice 3 : Message d'amitié
    const messageParts = document.querySelectorAll('.message-part');
    messageParts.forEach(part => {
        part.addEventListener('click', function() {
            const partId = this.getAttribute('data-part');
            addMessagePart(partId, this);
        });
    });
    
    // Bouton d'envoi du message
    const sendBtn = document.querySelector('.send-message-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            sendEmpathyMessage();
        });
    }
}

function handleEmotionChoice(emotion, button) {
    // Feedback visuel
    button.classList.add('selected');
    button.style.transform = 'scale(1.1)';
    
    // Ajouter des points d'empathie
    empathyScore += 2;
    updateEmpathyProgress();
    
    // Feedback selon l'émotion
    let feedback = '';
    switch(emotion) {
        case 'peur':
            feedback = "C'est normal d'avoir peur quand on ne comprend pas ce qui se passe. L'important est de rester calme pour pouvoir aider.";
            break;
        case 'calme':
            feedback = "Parfait ! Rester calme est la meilleure réaction. Cela permet de penser clairement et d'aider efficacement.";
            break;
        case 'confus':
            feedback = "C'est compréhensible d'être confus. Demander de l'aide à un adulte est la bonne chose à faire dans ce cas.";
            break;
    }
    
    // Afficher le feedback
    const scenario = button.closest('.scenario');
    if (scenario) {
        let feedbackElement = scenario.querySelector('.emotion-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'emotion-feedback';
            scenario.appendChild(feedbackElement);
        }
        feedbackElement.innerHTML = `<p style="color: var(--primary); margin-top: 10px;"><i class="fas fa-comment"></i> ${feedback}</p>`;
    }
}

function handleReactionChoice(isCorrect, button) {
    // Désactiver tous les boutons
    const allButtons = button.parentElement.querySelectorAll('.reaction-btn');
    allButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // Marquer la réponse
    if (isCorrect) {
        button.classList.add('selected-correct');
        empathyScore += 3;
        
        // Afficher le feedback positif
        showReactionFeedback("Bravo ! C'est la bonne réaction.", true);
    } else {
        button.classList.add('selected-wrong');
        
        // Trouver et montrer la bonne réponse
        const correctButton = button.parentElement.querySelector('.reaction-btn.correct');
        if (correctButton) {
            correctButton.classList.add('show-correct');
        }
        
        // Afficher le feedback
        showReactionFeedback("Ce n'est pas la meilleure réaction. Regarde la réponse correcte en vert.", false);
    }
    
    updateEmpathyProgress();
}

function showReactionFeedback(message, isCorrect) {
    const situation = document.querySelector('.situation');
    if (situation) {
        let feedbackElement = situation.querySelector('.reaction-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'reaction-feedback';
            situation.appendChild(feedbackElement);
        }
        
        const icon = isCorrect ? 'fa-check-circle' : 'fa-info-circle';
        const color = isCorrect ? 'var(--success)' : 'var(--warning)';
        feedbackElement.innerHTML = `
            <p style="color: ${color}; margin-top: 15px; padding: 10px; background: ${isCorrect ? '#E8F5E9' : '#FFF3E0'}; border-radius: 10px;">
                <i class="fas ${icon}"></i> ${message}
            </p>
        `;
    }
}

function addMessagePart(partId, button) {
    // Ajouter la partie au message
    if (!selectedMessageParts.includes(partId)) {
        selectedMessageParts.push(partId);
        button.classList.add('selected');
        button.style.background = 'var(--primary)';
        button.style.color = 'white';
        
        // Mettre à jour l'aperçu
        updateMessagePreview();
        
        // Ajouter des points d'empathie
        empathyScore += 1;
        updateEmpathyProgress();
    }
}

function updateMessagePreview() {
    const messagePartsText = [
        "Salut Léo,",
        "comment vas-tu ?",
        "Tu nous as fait peur,",
        "mais on est là pour toi.",
        "Veux-tu jouer avec nous ?"
    ];
    
    let message = "";
    selectedMessageParts.sort().forEach(partId => {
        const index = parseInt(partId) - 1;
        if (messagePartsText[index]) {
            message += messagePartsText[index] + " ";
        }
    });
    
    const preview = document.getElementById('constructed-message');
    if (preview) {
        preview.textContent = message || "Écris ton message ici...";
    }
}

function sendEmpathyMessage() {
    if (selectedMessageParts.length === 0) {
        alert("Compose un message d'abord en cliquant sur les phrases !");
        return;
    }
    
    // Ajouter des points
    empathyScore += 10;
    updateEmpathyProgress();
    
    // Afficher une confirmation
    const messageBuilder = document.querySelector('.message-builder');
    if (messageBuilder) {
        const confirmation = document.createElement('div');
        confirmation.className = 'message-confirmation';
        confirmation.innerHTML = `
            <div style="background: var(--success); color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                <i class="fas fa-check-circle"></i> Message envoyé ! Léo sera content de ton soutien.
            </div>
        `;
        messageBuilder.appendChild(confirmation);
        
        // Supprimer la confirmation après 3 secondes
        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
    
    // Réinitialiser le message
    selectedMessageParts = [];
    const messageParts = document.querySelectorAll('.message-part');
    messageParts.forEach(part => {
        part.classList.remove('selected');
        part.style.background = '';
        part.style.color = '';
    });
    
    updateMessagePreview();
}

function updateEmpathyProgress() {
    const progressFill = document.getElementById('empathy-progress');
    const levelElement = document.getElementById('empathy-level');
    
    if (!progressFill || !levelElement) return;
    
    // Calculer le pourcentage (max 50 points)
    const percentage = Math.min(100, (empathyScore / 50) * 100);
    progressFill.style.width = `${percentage}%`;
    
    // Déterminer le niveau
    let level = "Débutant";
    if (empathyScore >= 40) {
        level = "Expert en empathie !";
        progressFill.style.background = "linear-gradient(90deg, #FFD700, #FFC107)";
    } else if (empathyScore >= 25) {
        level = "Très empathique";
        progressFill.style.background = "linear-gradient(90deg, #4CAF50, #66BB6A)";
    } else if (empathyScore >= 15) {
        level = "En progression";
        progressFill.style.background = "linear-gradient(90deg, #2196F3, #64B5F6)";
    } else if (empathyScore >= 5) {
        level = "Apprenti";
        progressFill.style.background = "linear-gradient(90deg, #9C27B0, #BA68C8)";
    }
    
    levelElement.textContent = level;
    
    // Mettre à jour le score d'empathie dans le jeu
    const empathyElement = document.getElementById('empathy-score');
    if (empathyElement) {
        empathyElement.textContent = empathyScore;
    }
}

// ============================================
// QUIZ INTERACTIF
// ============================================

function initQuiz() {
    // Navigation du quiz
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion(currentQuestion);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentQuestion < quizQuestions.length - 1) {
                currentQuestion++;
                loadQuestion(currentQuestion);
            } else {
                showQuizResults();
            }
        });
    }
    
    // Écouter les réponses
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quiz-option')) {
            const option = e.target.closest('.quiz-option');
            checkAnswer(option);
        }
    });
}

function loadQuestion(questionIndex) {
    const question = quizQuestions[questionIndex];
    if (!question) return;
    
    // Mettre à jour la question
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
        questionElement.textContent = question.question;
    }
    
    // Mettre à jour les options
    const optionsContainer = document.getElementById('quiz-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.dataset.index = index;
            optionElement.dataset.correct = option.correct;
            optionElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 30px; height: 30px; background: var(--bg-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${String.fromCharCode(65 + index)}
                    </div>
                    <span>${option.text}</span>
                </div>
            `;
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Mettre à jour la progression
    updateQuizProgress(questionIndex);
    
    // Masquer le feedback
    const feedback = document.getElementById('quiz-feedback');
    if (feedback) {
        feedback.classList.remove('show');
        feedback.innerHTML = '';
    }
    
    // Mettre à jour les boutons de navigation
    updateQuizNavigation();
}

function checkAnswer(optionElement) {
    // Désactiver toutes les options
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    const isCorrect = optionElement.dataset.correct === 'true';
    const optionIndex = parseInt(optionElement.dataset.index);
    const question = quizQuestions[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    // Marquer la réponse
    if (isCorrect) {
        optionElement.classList.add('correct');
        quizScore += 20; // 20 points par bonne réponse
    } else {
        optionElement.classList.add('wrong');
        
        // Montrer la bonne réponse
        const correctIndex = question.options.findIndex(opt => opt.correct);
        const correctOption = document.querySelector(`[data-index="${correctIndex}"]`);
        if (correctOption) {
            correctOption.classList.add('correct');
        }
    }
    
    // Afficher le feedback
    showQuizFeedback(selectedOption.feedback, isCorrect);
    
    // Mettre à jour le score
    updateQuizScore();
    
    // Mettre à jour la navigation
    updateQuizNavigation();
}

function showQuizFeedback(message, isCorrect) {
    const feedback = document.getElementById('quiz-feedback');
    if (feedback) {
        const icon = isCorrect ? 'fa-check-circle' : 'fa-info-circle';
        const color = isCorrect ? 'var(--success)' : 'var(--warning)';
        const bgColor = isCorrect ? '#E8F5E9' : '#FFF3E0';
        
        feedback.innerHTML = `
            <div style="background: ${bgColor}; border-left: 5px solid ${color}; padding: 20px; border-radius: 10px;">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <i class="fas ${icon}" style="color: ${color}; font-size: 1.5rem; margin-top: 2px;"></i>
                    <div>
                        <h4 style="color: ${color}; margin-bottom: 10px;">
                            ${isCorrect ? 'Bonne réponse !' : 'Presque...'}
                        </h4>
                        <p style="color: var(--text-medium);">${message}</p>
                    </div>
                </div>
            </div>
        `;
        feedback.classList.add('show');
    }
}

function updateQuizProgress(questionIndex) {
    const progressSteps = document.querySelectorAll('.quiz-progress .progress-step');
    progressSteps.forEach((step, index) => {
        if (index <= questionIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function updateQuizScore() {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
        scoreElement.textContent = quizScore;
    }
}

function updateQuizNavigation() {
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 0;
    }
    
    if (nextBtn) {
        if (currentQuestion === quizQuestions.length - 1) {
            nextBtn.innerHTML = 'Voir les résultats <i class="fas fa-trophy"></i>';
        } else {
            nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
        }
    }
}

function showQuizResults() {
    const percentage = Math.round((quizScore / 100) * 100);
    const container = document.querySelector('.quiz-content');
    
    if (!container) return;
    
    let message, icon, color;
    if (percentage >= 80) {
        message = "Fantastique ! Tu es un vrai super-héros de l'empathie ! 🏆";
        icon = "fas fa-trophy";
        color = "#FFD700";
    } else if (percentage >= 60) {
        message = "Excellent ! Tu as vraiment compris l'essentiel. 👍";
        icon = "fas fa-star";
        color = "#4CAF50";
    } else if (percentage >= 40) {
        message = "Bien joué ! Tu progresses dans ta compréhension. 😊";
        icon = "fas fa-thumbs-up";
        color = "#2196F3";
    } else {
        message = "Continue à apprendre ! Chaque effort compte. 📚";
        icon = "fas fa-book";
        color = "#9C27B0";
    }
    
    container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 5rem; color: ${color}; margin-bottom: 20px;">
                <i class="${icon}"></i>
            </div>
            <h3 style="color: ${color}; margin-bottom: 20px; font-size: 2rem;">${message}</h3>
            
            <div style="background: var(--bg-light); padding: 30px; border-radius: 20px; display: inline-block; margin: 20px 0;">
                <div style="font-size: 3.5rem; font-weight: bold; color: ${color}; margin-bottom: 10px;">
                    ${percentage}%
                </div>
                <div style="font-size: 1.2rem; color: var(--text-medium);">
                    ${quizScore} points sur 100
                </div>
            </div>
            
            <p style="margin: 30px 0; font-size: 1.1rem; color: var(--text-medium); max-width: 600px; margin-left: auto; margin-right: auto;">
                Tu as maintenant les connaissances pour comprendre et aider tes amis qui vivent avec l'épilepsie !
            </p>
            
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 40px;">
                <button id="restart-quiz" class="quiz-nav-btn" style="background: linear-gradient(135deg, var(--primary), var(--primary-light));">
                    <i class="fas fa-redo"></i> Refaire le quiz
                </button>
                <button id="back-to-empathy" class="quiz-nav-btn" style="background: linear-gradient(135deg, var(--secondary), var(--secondary-light));">
                    <i class="fas fa-heart"></i> Exercices d'empathie
                </button>
            </div>
        </div>
    `;
    
    // Ajouter les écouteurs d'événements aux nouveaux boutons
    document.getElementById('restart-quiz').addEventListener('click', function() {
        currentQuestion = 0;
        quizScore = 0;
        loadQuestion(currentQuestion);
        updateQuizScore();
    });
    
    document.getElementById('back-to-empathy').addEventListener('click', function() {
        showSection('empathy');
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === 'empathy') {
                btn.classList.add('active');
            }
        });
    });
}

// ============================================
// INTERACTIONS DES PERSONNAGES
// ============================================

function initCharacterInteractions() {
    const characters = document.querySelectorAll('.character');
    characters.forEach(character => {
        character.addEventListener('click', function() {
            const charId = this.id;
            showCharacterInfo(charId);
        });
    });
}

function showCharacterInfo(characterId) {
    let name = "", description = "", superpower = "";
    
    switch(characterId) {
        case 'leo':
            name = "Léo";
            description = "Léo a 8 ans et il a de l'épilepsie depuis qu'il a 5 ans. Il aime les dinosaures, le football et les jeux vidéo.";
            superpower = "Son super-pouvoir : comprendre ce que ressentent les autres parce qu'il sait ce que c'est d'être différent.";
            break;
        case 'chloe':
            name = "Chloé";
            description = "Chloé a 8 ans aussi. Elle était un peu peur au début, mais maintenant elle sait exactement comment aider Léo.";
            superpower = "Son super-pouvoir : rester calme et savoir exactement quoi faire en cas de besoin.";
            break;
        case 'tom':
            name = "Tom";
            description = "Tom a 9 ans. Il est le protecteur du groupe et s'assure que tout le monde se sente en sécurité et inclus.";
            superpower = "Son super-pouvoir : voir les dangers potentiels et les éviter avant qu'ils n'arrivent.";
            break;
    }
    
    // Afficher une bulle d'information
    const character = document.getElementById(characterId);
    if (character) {
        // Supprimer les anciennes bulles
        const oldBubble = character.querySelector('.character-bubble');
        if (oldBubble) oldBubble.remove();
        
        // Créer une nouvelle bulle
        const bubble = document.createElement('div');
        bubble.className = 'character-bubble';
        bubble.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 15px; box-shadow: var(--shadow-lg); width: 250px; position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); z-index: 1000;">
                <h4 style="color: var(--primary); margin-bottom: 10px;">${name}</h4>
                <p style="font-size: 0.9rem; margin-bottom: 10px; color: var(--text-medium);">${description}</p>
                <p style="font-size: 0.9rem; color: var(--accent); font-weight: bold;">${superpower}</p>
                <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;"></div>
            </div>
        `;
        
        character.appendChild(bubble);
        
        // Supprimer la bulle après 5 secondes
        setTimeout(() => {
            bubble.remove();
        }, 5000);
    }
}

// ============================================
// LECTEUR VIDÉO ESPACE ÉLÈVES
// ============================================

function initVideoPlaceholder() {
    const video = document.getElementById('videoEleves');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const progressFill = document.getElementById('videoProgressFill');
    const progressBar = document.getElementById('videoProgressBar');

    if (!video) return;

    // Fallback si la vidéo ne charge pas (déploiement : chemin ou nom de fichier)
    var videoTriedFallback = false;
    video.addEventListener('error', function onVideoError() {
        if (videoTriedFallback) return;
        videoTriedFallback = true;
        video.removeEventListener('error', onVideoError);
        video.src = "assets/documents/eleves/vd%20de%20l%27espace%20%C3%A9l%C3%A8ve.mp4";
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (video.paused) {
                video.play();
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                video.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    video.addEventListener('play', function() {
        const icon = playPauseBtn && playPauseBtn.querySelector('i');
        if (icon) { icon.classList.remove('fa-play'); icon.classList.add('fa-pause'); }
    });
    video.addEventListener('pause', function() {
        const icon = playPauseBtn && playPauseBtn.querySelector('i');
        if (icon) { icon.classList.remove('fa-pause'); icon.classList.add('fa-play'); }
    });

    if (progressBar && progressFill) {
        video.addEventListener('timeupdate', function() {
            const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
            progressFill.style.width = pct + '%';
        });
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            video.currentTime = pct * video.duration;
        });
    }

    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (video.muted) {
                video.muted = false;
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
            } else {
                video.muted = true;
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
            }
        });
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Animation de confettis pour les succès
function showConfetti() {
    const confettiCount = 50;
    const colors = ['#5D5FEF', '#FF9E5D', '#9D4EDD', '#4CAF50', '#FFC107'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            top: -20px;
            left: ${Math.random() * 100}vw;
            z-index: 10000;
            pointer-events: none;
            animation: fall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Supprimer après l'animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Ajouter l'animation CSS si elle n'existe pas
    if (!document.querySelector('#confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Sauvegarder la progression dans le localStorage
function saveProgress() {
    const progress = {
        empathyScore: empathyScore,
        quizScore: quizScore,
        lastSection: currentSection,
        storyChapter: currentChapter,
        lastVisit: new Date().toISOString()
    };
    
    localStorage.setItem('coinElevesProgress', JSON.stringify(progress));
}

// Charger la progression depuis le localStorage
function loadProgress() {
    const saved = localStorage.getItem('coinElevesProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            empathyScore = progress.empathyScore || 0;
            quizScore = progress.quizScore || 0;
            currentChapter = progress.storyChapter || 1;
            
            // Mettre à jour l'affichage
            updateGameStats();
            updateEmpathyProgress();
            updateQuizScore();
            
            console.log('Progression chargée :', progress);
        } catch (e) {
            console.error('Erreur lors du chargement de la progression :', e);
        }
    }
}

// Sauvegarder la progression avant de quitter
window.addEventListener('beforeunload', saveProgress);

// Charger la progression au démarrage
setTimeout(loadProgress, 100);

// ============================================
// EXPORT DES FONCTIONS POUR LE DÉVELOPPEMENT
// ============================================

// Pour le débogage et le développement
window.coinEleves = {
    showSection,
    loadChapter,
    handleGameAction,
    updateEmpathyProgress,
    loadQuestion,
    showConfetti,
    saveProgress,
    loadProgress,
    
    // Données (en lecture seule)
    get gameState() {
        return {
            empathyScore,
            quizScore,
            protectionScore,
            stormCount,
            calmCount,
            currentChapter,
            currentQuestion
        };
    }
};

console.log('Coin Élèves - Prêt ! 🧠'); 