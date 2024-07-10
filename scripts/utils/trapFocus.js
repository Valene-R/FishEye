/**
 * Gère le focus à l'intérieur de la modale
 * @param {KeyboardEvent} event L'événement de clavier déclenché par une touche
 * @param {HTMLElement} container Le conteneur dans lequel le focus doit être piégé
 */
export function trapFocus(event, container) {
    // Sélectionne tous les éléments focusables dans le conteneur
    const focusableElements = container.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    // Si aucun élément focusable n'est trouvé, ne fait rien
    if (focusableElements.length === 0) 
        return;
    
    // Sélectionne le premier et le dernier élément focusable
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === "Tab" || event.code === "Tab") {
        if (event.shiftKey) {
            // Navigation inverse (Shift + Tab)
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus(); // Déplace le focus sur le dernier élément
            }
        } else {
            // Navigation normale (Tab)
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus(); // Déplace le focus sur le premier élément
            }
        }
    }
}

