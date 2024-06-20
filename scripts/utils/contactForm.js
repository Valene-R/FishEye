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
    modal.setAttribute("aria-hidden", "false"); // Indique que la modale est visible pour les lecteurs d'écran
    document.querySelector(".contact_button").focus(); // Met le focus sur le bouton de contact

    // Désactive le scroll sur la page principale en arrière-plan
    document.body.style.overflow = "hidden";
}
 

/**
 * Ferme la modale 
 */
export function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true"); // Indique que la modale est cachée pour les lecteurs d'écran
    document.querySelector(".contact_button").focus();

    // Réactive le scroll sur la page principale
    document.body.style.overflow = "auto";

    // Réinitialise le formulaire
    document.getElementById("contact-form").reset();
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

    // Réinitialise le formulaire 
    event.target.reset();

    // Ferme la modale après l'envoi du formulaire
    closeModal();
});

// Ajoute des écouteurs d'événements aux boutons
document.querySelector(".contact_button").addEventListener("click", displayModal);
document.querySelector(".close-button").addEventListener("click", closeModal);