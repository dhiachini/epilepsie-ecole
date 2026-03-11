/**
 * Téléchargement PDF réutilisable
 * Utilisation : ajouter data-pdf="dossier/fichier.pdf" sur un lien ou bouton.
 * Ex. data-pdf="enseignants/module1.pdf" ou data-pdf="parents/guide.pdf"
 * Les fichiers sont cherchés dans assets/documents/
 */
(function() {
    'use strict';

    var BASE_PATH = 'assets/documents/';

    /**
     * Ouvre un fichier (PDF ou autre) dans un nouvel onglet (sans quitter la page).
     * @param {string} relativePath - Chemin relatif sous assets/documents/ (ex. "enseignants/module1.pdf" ou "parents/guide.pdf")
     */
    function downloadPdf(relativePath) {
        if (!relativePath || typeof relativePath !== 'string') return;
        var path = relativePath.replace(/^\/+/, '');
        var href = BASE_PATH + path;
        window.open(href, '_blank', 'noopener,noreferrer');
    }

    /**
     * Initialise les clics sur tous les éléments ayant l'attribut data-pdf.
     */
    function init() {
        document.querySelectorAll('[data-pdf]').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                var path = this.getAttribute('data-pdf');
                if (path) downloadPdf(path);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.downloadPdf = downloadPdf;
})();
