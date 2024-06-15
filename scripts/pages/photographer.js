import { ApiManager } from "../api/apiManager.js";
import { displayError } from "../utils/displayError.js";
import { PhotographerTemplate } from "../templates/photographer.js";


/**
 * Initialise la page du photographe en récupérant les données du photographe spécifique
 */
async function initPhotographerPage() {
    const api = new ApiManager("data");

    try {
        const photographers = await api.getPhotographers();
        const photographerId = getPhotographerIdFromUrl();

        if (photographerId) {
            const photographer = photographers.find(p => p.id == photographerId);
            if (photographer) {
                displayPhotographerData(photographer);
            } else {
                displayError("Photographe non trouvé.");
            }
        } else {
            displayError("Aucun ID de photographe spécifié dans l'URL.");
        }
    } catch {
        displayError("Erreur lors du chargement des données du photographe. Veuillez réessayer plus tard.");
    }
}


/**
 * Affiche les données du photographe spécifique dans le DOM
 * @param {Object} photographer Un objet représentant le photographe
 */
function displayPhotographerData(photographer) {
    const header = document.querySelector(".photograph-header");
    const photographerModel = new PhotographerTemplate(photographer);
    const photographerHeaderDOM = photographerModel.getPhotographerPageDOM();
    header.appendChild(photographerHeaderDOM);
}


/**
 * Récupère l'ID du photographe à partir de l'URL
 * @returns {string|null} L'ID du photographe ou null si non présent
 */
function getPhotographerIdFromUrl() {
    // Récupère l'URL actuelle
    const currentUrl = window.location.href;
    
    // Crée un objet URL basé sur l'URL actuelle
    const url = new URL(currentUrl);
    
    // Utilise URLSearchParams pour extraire les paramètres de l'URL
    const searchParams = new URLSearchParams(url.search);
    const id = searchParams.get("id");
    
    return id;
}


// Appelle la fonction initPhotographerPage lors du chargement du script pour la page du photographe
initPhotographerPage();