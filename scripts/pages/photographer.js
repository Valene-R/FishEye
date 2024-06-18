import { ApiManager } from "../api/apiManager.js";
import { displayError } from "../utils/displayError.js";
import { PhotographerTemplate } from "../templates/photographer.js";
import { MediaFactory } from "../factories/mediaFactory.js";


/**
 * Initialise la page du photographe en récupérant les données du photographe spécifique
 */
async function initPhotographerPage() {
    // Crée une instance d'ApiManager avec la baseURL "data"
    const api = new ApiManager("data");

    try {
        const photographers = await api.getPhotographers();
        const photographerId = getPhotographerIdFromUrl();

        if (photographerId) {
            const photographer = photographers.find(p => p.id == photographerId);
            if (photographer) {
                displayPhotographerData(photographer);
                displayMedia(photographerId, photographer.name);
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
 * Affiche les réalisations du photographe spécifique dans le DOM
 * @param {number} photographerId L'ID du photographe
 * @param {string} photographerName Le nom du photographe
 */
async function displayMedia(photographerId, photographerName) {
    const api = new ApiManager("data", "assets/icons");

    // Appelle la méthode getMedia() de l'ApiManager pour récupérer les données des médias
    const mediaData = await api.getMedia();
    // Appelle la méthode getSVG() de l'ApiManager pour récupérer le contenu du fichier .svg 
    const heartSVG = await api.getSVG("heart.svg");

    // Crée une nouvelle div pour contenir les médias
    const mediaSection =document.createElement("div");
    mediaSection.className = "media_section";
    // Ajoute cette nouvelle div à l'élément <main> du document
    document.querySelector("main").appendChild(mediaSection);

    // Filtre et affiche les médias du photographe spécifique
    mediaData
        .filter(media => media.photographerId == photographerId)
        .forEach(media => {
            // Ajoute le nom du photographe aux données de chaque média
            media.photographerName = photographerName; 
            // Crée un élément média (photo ou vidéo) en utilisant la MediaFactory, en passant heartSVG
            const mediaElement = MediaFactory.createMedia(media, heartSVG);
            // Ajoute mediaElement créé à mediaSection
            mediaSection.appendChild(mediaElement.createMediaElement());
        });
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