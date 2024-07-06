/**
 * Initialise le lazy loading pour les images et vidéos présentes sur la page
 */
export function initLazyLoad() {
    // Sélectionne toutes les images et vidéos ayant l'attribut "loading" avec la valeur "lazy"
    const lazyLoadMedia = document.querySelectorAll('img[loading="lazy"], video[loading="lazy"]');

    // Parcourt chaque média sélectionné
    lazyLoadMedia.forEach(media => {
        // Si le média est visible dans la fenêtre d'affichage (viewport)
        if (isInViewport(media)) {
            // Change l'attribut "loading" de "lazy" à "eager" pour charger immédiatement le média
            media.setAttribute("loading", "eager");
        }
    });

    /**
     * Vérifie si un élément est dans la fenêtre d'affichage (viewport)
     * @param {HTMLElement} element L'élément à vérifier
     * @returns {boolean} Retourne true si l'élément est visible dans le viewport, sinon false
     */
    function isInViewport(element) {
        // Obtient les dimensions et la position de l'élément
        const rect = element.getBoundingClientRect();
        // Vérifie si l'élément est entièrement dans la fenêtre d'affichage
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}