/**
 * Affiche un message d'erreur à l'utilisateur en cas de problème lors de la récupération ou de l'affichage des données
 * @param {string} message Le message d'erreur à afficher
 */
export function displayError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message"; 
    document.body.appendChild(errorElement);

    // Définit le contenu du message et le rend visible
    errorElement.textContent = message;
    errorElement.style.display = "block"; 
}