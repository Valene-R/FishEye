import { ApiManager } from "../api/apiManager.js";
import { PhotographerTemplate } from "../templates/photographer.js";
import { displayError } from "../utils/displayError.js";
import { initLazyLoad } from "../utils/lazyLoad.js";


/**
 * Initialise la page en récupérant les données des photographes et en gérant l'affichage des données
 * ou les erreurs potentielles
 */
async function initHomePage() {
    const api = new ApiManager("data");

    try {
        const photographers = await api.getPhotographers();
        if (photographers.length > 0) {
            displayData(photographers);
        } else {
            displayError("Aucun photographe trouvé.");
        }
    } catch {
        displayError("Erreur lors du chargement des données des photographes. Veuillez réessayer plus tard.");
    }
}


/**
 * Affiche les données des photographes dans le DOM
 * @param {Array} photographers Un tableau d'objets représentant les photographes
 */
async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    // Utilise un DocumentFragment pour minimiser les réécritures dans le DOM
    // Crée un DocumentFragment pour regrouper les éléments DOM avant de les attacher au document
    const fragment = document.createDocumentFragment();

    // Boucle sur chaque photographe et ajoute son élément DOM au fragment
    photographers.forEach(photographer => {
        // Instancie la classe PhotographerTemplate avec les données du photographe
        const photographerModel = new PhotographerTemplate(photographer);
        // Crée l'élément DOM pour le photographe en utilisant la méthode définie dans la classe PhotographerTemplate
        const userCardDOM = photographerModel.getUserCardDOM();
        // Ajoute l'élément du photographe au fragment, pas directement au DOM principal
        fragment.appendChild(userCardDOM);
    });
    // Ajoute le fragment complet à la section des photographes dans le DOM principal: permet de minimiser les modifications du DOM et optimise les performances
    photographersSection.appendChild(fragment);

    // Initialise le lazy loading après avoir inséré les éléments dans le DOM
    initLazyLoad();
}
    

// Appelle la fonction initHomePage lors du chargement du script
initHomePage();
