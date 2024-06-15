import { ApiManager } from "../api/apiManager.js";
import { displayError } from "../utils/displayError.js";


/**
 * Initialise la page du photographe en récupérant les données du photographe spécifique
 */
async function initPhotographerPage() {
    const api = new ApiManager("data");

    try {
        const photographers = await api.getPhotographers();
        const photographerId = getPhotographerIdFromUrl();

        if (photographerId) {
            photographers.find(p => p.id == photographerId);
        } else {
            displayError("Aucun ID de photographe spécifié dans l'URL.");
        }
    } catch {
        displayError("Erreur lors du chargement des données du photographe. Veuillez réessayer plus tard.");
    }
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