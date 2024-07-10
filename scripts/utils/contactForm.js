import { trapFocus } from "./trapFocus.js";

/**
 * Affiche la modale 
 */
export function displayModal() {
    const modal = document.getElementById("contact_modal");
    const photographerNameElement = document.querySelector(".header-title");
    if (photographerNameElement) {
        // Récupère le texte du nom du photographe
        const photographerName = photographerNameElement.textContent; 
        // Met à jour le titre de la modale
        document.getElementById("contact-me").textContent = `Contactez-moi ${photographerName}`;
    }
  
    modal.style.display = "block";
    document.body.setAttribute("aria-hidden", "true"); // Masque tout le contenu en arrière-plan pour les lecteurs d'écran
    modal.setAttribute("aria-hidden", "false"); // Indique que la modale est visible pour les lecteurs d'écran

    modal.querySelector("input, button, textarea").focus(); // Met le focus sur le premier élément interactif de la modale
    
    // Désactive le scroll sur la page principale en arrière-plan
    document.body.style.overflow = "hidden";

    // Ajoute un écouteur d'événement pour fermer la modale avec la touche "échap"
    document.addEventListener("keydown", handleKeyDown);

    // Ajoute un écouteur d'événement pour gérer le focus à l'intérieur de la modale
    document.addEventListener("keydown", (event) => trapFocus(event, modal));
}
 

/**
 * Ferme la modale 
 */
export function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true"); // Indique que la modale est cachée pour les lecteurs d'écran
    document.body.setAttribute("aria-hidden", "false"); // Rétablit l'accessibilité du contenu en arrière-plan pour les lecteurs d'écran
    document.querySelector(".contact_button").focus(); // Met le focus sur le bouton d'ouverture de la modale

    // Réactive le scroll sur la page principale
    document.body.style.overflow = "auto";

    // Réinitialise le formulaire
    document.getElementById("contact-form").reset();

    // Supprime les écouteurs d'événements pour la touche "échap" et le focus
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keydown", (event) => trapFocus(event, modal));

    // Réinitialise le style du bouton
    resetButtonStyle(); 
}


/**
 * Affiche une notification de succès
 */
export function showToast() {
    const toast = document.createElement("div");
    toast.className = "toast";
    // Définit le rôle de la notification pour l'accessibilité
    toast.setAttribute("role", "alert");
    // Définit l'aria-live pour informer les lecteurs d'écran que ce message doit être lu immédiatement
    toast.setAttribute("aria-live", "assertive"); 
    toast.textContent = "Votre message a bien été envoyé !";
    document.body.appendChild(toast);
  
    // Supprime la notification après un délai
    setTimeout(() => {
        toast.remove();
    }, 4000);
}


/**
 * Gère la fermeture de la modale avec la touche "échap"
 * @param {KeyboardEvent} event L'événement de clavier déclenché par une touche
 */
function handleKeyDown(event) {
    if (event.key === "Escape" || event.code === "Escape") {
        closeModal();
    }
}


/**
 * Réinitialise le style du bouton "Envoyer"
 */
function resetButtonStyle() {
    const button = document.querySelector(".contact_button.btn_bgcolor");
    button.style.backgroundColor = "#901C1C"; // Couleur par défaut
    button.style.color = "#FFF";
    button.style.fontWeight = "400";
}


/////////
///// EVENT LISTENERS
////////

// Gère l'envoi du formulaire
document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Récupère les données du formulaire
    const formProps = Object.fromEntries(formData); // Convertit les données du formulaire en un objet

    // Affiche les données du formulaire dans la console
    console.log(formProps); 

    // Affiche la notification
    showToast();

    // Réinitialise le formulaire 
    event.target.reset();

    // Réinitialise le style du bouton
    resetButtonStyle();

    // Ferme la modale après l'envoi du formulaire
    closeModal();
});

// Ajoute des écouteurs d'événements aux boutons
document.querySelector(".contact_button").addEventListener("click", displayModal);
document.querySelector(".close-button").addEventListener("click", closeModal);