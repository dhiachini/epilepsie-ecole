# Épilepsie à l'École

Plateforme pédagogique pour informer, rassurer et accompagner la communauté éducative face à l'épilepsie en milieu scolaire.

**Projet de Fin d'Études** — Essra Slimeni & Eya Saadi

---

## Structure du projet (HTML / CSS / JS)

```
Projet Israa/
├── index.html              # Page d'accueil
├── guide.html              # Guide sur l'épilepsie scolaire
├── espace-parents.html     # Espace Parents
├── espace-enseignants.html # Espace Enseignants
├── espace-eleves.html      # Espace Élèves
├── css/
│   ├── accueil.css
│   ├── guide.css
│   ├── espace-parents.css
│   ├── espace-enseignants.css
│   └── espace-eleves.css
├── js/
│   ├── accueil.js
│   ├── guide.js
│   ├── espace-parents.js
│   ├── espace-enseignants.js
│   ├── espace-eleves.js
│   └── pdf-download.js   # Téléchargement PDF réutilisable
├── assets/                 # Ressources (images, polices, documents)
│   ├── images/
│   ├── fonts/
│   └── documents/          # Fichiers PDF
│       ├── enseignants/     # Documents pour les enseignants
│       └── parents/         # Documents pour les parents
└── README.md
```

- **Racine** : tous les fichiers HTML (point d’entrée = `index.html`).
- **css/** : une feuille de style par page.
- **js/** : un script par page.
- **assets/** : ressources (images, polices).

## Lancer le site en local

1. Ouvrir le dossier dans un navigateur via un serveur local (recommandé).
2. **Python** : à la racine du projet :
   ```bash
   python -m http.server 8000
   ```
   Puis ouvrir : **http://localhost:8000**
3. **VS Code** : extension "Live Server", clic droit sur `index.html` → "Open with Live Server".

## Technologies

- HTML5, CSS3 (variables, flexbox, grid), JavaScript
- Font Awesome, Google Fonts, Animate.css, Swiper, Chart.js (CDN)

---

© 2026 — Essra Slimeni & Eya Saadi
