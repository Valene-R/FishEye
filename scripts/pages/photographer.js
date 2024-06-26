import { ApiManager } from "../api/apiManager.js";
import { displayError } from "../utils/displayError.js";
import { PhotographerTemplate } from "../templates/photographer.js";
import { MediaFactory } from "../factories/mediaFactory.js";
import { Lightbox } from "../utils/lightbox.js";


/**
 * Initialise la page du photographe en récupérant les données du photographe spécifique
 */
async function initPhotographerPage() {
    // Crée une instance d'ApiManager avec la baseURL "data" et "assets/icons"
    const api = new ApiManager("data", "assets/icons");

    try {
        const photographers = await api.getPhotographers();
        const photographerId = getPhotographerIdFromUrl();

        // Vérifie si l'ID du photographe est présent dans l'URL
        if (photographerId) {
            // Trouve le photographe correspondant à l'ID spécifié
            const photographer = photographers.find(p => p.id == photographerId);
            if (photographer) {
                const heartSVG = await api.getSVG("heart.svg");
                // Crée une instance de PhotographerTemplate avec les données du photographe et le svg
                const photographerTemplate = new PhotographerTemplate(photographer, heartSVG);
                // Affiche les données du photographe dans le DOM
                displayPhotographerData(photographerTemplate);
                // Affiche les médias du photographe dans le DOM
                displayMedia(photographerId, photographer.name, photographerTemplate);
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
 * @param {PhotographerTemplate} photographerTemplate Une instance de PhotographerTemplate représentant le photographe
 */
function displayPhotographerData(photographerTemplate) {
    const header = document.querySelector(".photograph-header");
    const photographerHeaderDOM = photographerTemplate.getPhotographerPageDOM();
    header.appendChild(photographerHeaderDOM);
}


/**
 * Affiche les réalisations du photographe spécifique dans le DOM
 * @param {number} photographerId L'ID du photographe
 * @param {string} photographerName Le nom du photographe
 * @param {PhotographerTemplate} photographerTemplate Une instance de PhotographerTemplate représentant le photographe
 */
async function displayMedia(photographerId, photographerName, photographerTemplate) {
    const api = new ApiManager("data", "assets/icons")

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

            // Crée un élément média (photo ou vidéo) en utilisant la MediaFactory
            // en passant les données du média, le heartSVG et l'instance de PhotographerTemplate
            const mediaElement = MediaFactory.createMedia(media, heartSVG, photographerTemplate);

            // Ajoute mediaElement créé à mediaSection
            mediaSection.appendChild(mediaElement.createMediaElement());

            // Met à jour le nombre total de likes du photographe
            photographerTemplate.updateTotalLikes(media.likes);
        });

    // Sélectionne tous les éléments de média avec l'attribut data-lightbox="media-item"
    const mediaItems = document.querySelectorAll('[data-lightbox="media-item"]');

    // Initialise la lightbox avec les éléments média
    const lightbox = new Lightbox(api);
    lightbox.init(mediaItems);
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