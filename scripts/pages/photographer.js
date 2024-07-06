import { ApiManager } from "../api/apiManager.js";
import { displayError } from "../utils/displayError.js";
import { PhotographerTemplate } from "../templates/photographer.js";
import { MediaFactory } from "../factories/mediaFactory.js";
import { Lightbox } from "../utils/lightbox.js";
import { sortMedia } from "../utils/sortMedia.js";
import { LikeObserver } from "../utils/likeObserver.js";
import { initLazyLoad } from "../utils/lazyLoad.js";

// Crée une instance de LikeObserver
const likeObserver = new LikeObserver();

/**
 * Initialise la page du photographe en récupérant les données du photographe spécifique
 */
async function initPhotographerPage() {
    // Crée une instance d'ApiManager avec la baseURL "data" et "assets/icons"
    const api = new ApiManager("data", "assets/icons");

    try {
        // Récupère les données des photographes et des médias
        const photographers = await api.getPhotographers();
        const mediaData = await api.getMedia();
        const photographerId = getPhotographerIdFromUrl();

        // Vérifie si l'ID du photographe est présent dans l'URL
        if (photographerId) {
            // Trouve le photographe correspondant à l'ID spécifié
            const photographer = photographers.find(p => p.id == photographerId);
            if (photographer) {
                const heartSVG = await api.getSVG("heart.svg");
                const filteredMedia = mediaData.filter(media => media.photographerId == photographerId);
                
                // Calcule le nombre total de "likes" pour tous les médias du photographe
                const initialTotalLikes = filteredMedia.reduce((total, media) => total + media.likes, 0);

                // Crée une instance de PhotographerTemplate avec les données du photographe et le svg
                const photographerTemplate = new PhotographerTemplate(photographer, heartSVG, initialTotalLikes);
                
                // Affiche les données du photographe dans le DOM
                displayPhotographerData(photographerTemplate);

                // Crée une nouvelle div pour contenir les médias 
                const mediaSection = document.createElement("div");
                mediaSection.className = "media_section";
                document.querySelector("main").appendChild(mediaSection);

                // Affiche les médias du photographe dans le DOM
                displayMedia(photographerId, photographer.name, photographerTemplate);

                // Initialise le menu déroulant de tri
                initDropdown(photographerTemplate);

                // S'abonne aux notifications de l'Observer pattern
                likeObserver.subscribe("like", ({ id, likes }) => {
                    const media = filteredMedia.find(media => media.id === id);
                    if (media) {
                        media.likes = likes;
                    }
                });

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
 * @param {string} sortBy Le critère de tri ("popularité", "date" ou "titre")
 */
async function displayMedia(photographerId, photographerName, photographerTemplate, sortBy = "popularité") {
    const api = new ApiManager("data", "assets/icons");

    // Appelle la méthode getMedia() de l'ApiManager pour récupérer les données des médias
    const mediaData = await api.getMedia();
    // Appelle la méthode getSVG() de l'ApiManager pour récupérer le contenu du fichier .svg
    const heartSVG = await api.getSVG("heart.svg");

    // Filtre les médias pour n'afficher que ceux du photographe spécifique
    const filteredMedia = mediaData.filter(media => media.photographerId == photographerId);

    // Trie les médias en fonction du critère sélectionné
    const sortedMedia = sortMedia(filteredMedia, sortBy);

    const mediaSection = document.querySelector(".media_section");
    mediaSection.innerHTML = " ";

    // Affiche chaque média dans le DOM
    sortedMedia.forEach(media => {
        // Ajoute le nom du photographe aux données de chaque média
        media.photographerName = photographerName;

        // Crée un élément média (photo ou vidéo) en utilisant la MediaFactory
        // en passant les données du média, le heartSVG et l'instance de PhotographerTemplate
        const mediaElement = MediaFactory.createMedia(media, heartSVG, photographerTemplate);
        
        // Ajoute mediaElement créé à mediaSection
        mediaSection.appendChild(mediaElement.createMediaElement());
    });

    // Initialise le lazy loading après avoir inséré les éléments dans le DOM
    initLazyLoad();

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


/**
 * Initialise le menu déroulant de tri
 * @param {PhotographerTemplate} photographerTemplate 
 */
async function initDropdown(photographerTemplate) {
    const button = document.querySelector(".dropdown-toggle");
    const buttonText = button.querySelector(".button-text");
    const dropdown = document.querySelector(".dropdown");
    const menu = document.querySelector(".dropdown-menu");
    const options = menu.querySelectorAll("li");

    const api = new ApiManager("data", "assets/icons");

    // Récupère et ajoute le SVG du chevron au bouton du menu déroulant
    const chevronDropdown = await api.getSVG("chevronDropdown.svg");
    const chevronElement = button.querySelector(".chevron");
    chevronElement.innerHTML = chevronDropdown;

    // Masque l'option sélectionnée dans le menu déroulant
    function hideSelectedOption() {
        options.forEach(option => {
            if (option.textContent === buttonText.textContent) {
                option.style.display = "none"; // Masque l'option actuellement sélectionnée
            } else {
                option.style.display = "block"; // Affiche les autres options
            }
        });
    }

    hideSelectedOption();

    // Gére l'ouverture et de la fermeture du menu déroulant au clic du bouton
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const expanded = button.getAttribute("aria-expanded") === "true"; // Vérifie si le menu est actuellement ouvert
        // Met à jour l'attribut aria-expanded pour refléter le nouvel état
        button.setAttribute("aria-expanded", !expanded);
        // Bascule la classe "open" du bouton pour appliquer les styles correspondants
        button.classList.toggle("open", !expanded);
        menu.style.display = expanded ? "none" : "block"; // Affiche ou cache le menu

        // Si le menu s'ouvre, masque l'option sélectionnée
        if (!expanded) {
            hideSelectedOption(); // Masque l'option actuellement sélectionnée pour ne pas l'afficher dans la liste
        }
    });

    // Gére la sélection d'une option du menu
    options.forEach(option => {
        option.addEventListener("click", () => {
            options.forEach(opt => opt.setAttribute("aria-selected", "false"));
            option.setAttribute("aria-selected", "true");
            buttonText.textContent = option.textContent;
            button.setAttribute("aria-expanded", "false");
            button.classList.remove("open");
            menu.style.display = "none";

            hideSelectedOption();

            // Met à jour aria-activedescendant
            button.setAttribute("aria-activedescendant", option.id);

            const sortBy = option.dataset.value; // Récupère la valeur de tri de l'option sélectionnée
            const photographerId = getPhotographerIdFromUrl(); // Récupère l'ID du photographe à partir de l'URL
            const photographerName = document.querySelector(".header-title").textContent; // Récupère le nom du photographe
            displayMedia(photographerId, photographerName, photographerTemplate, sortBy); // Affiche les médias triés
        });

        // Gére la sélection de l'option au clavier
        option.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                option.click(); // Simule un clic sur l'option
            }
        });
    });

    // Gére la fermeture du menu lorsque l'utilisateur clique en dehors
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            button.setAttribute("aria-expanded", "false");
            button.classList.remove("open");
            menu.style.display = "none";
        }
    });

    // Gére la navigation au clavier pour le bouton du menu déroulant
    button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { // Si la touche "Flèche vers le bas" ou "Flèche vers le haut" est pressée
            event.preventDefault();
            const firstOption = options[0]; // Sélectionne la première option du menu
            firstOption.focus(); // Déplace le focus sur la première option
        }
    });

    // Gére la navigation au clavier pour les options du menu
    options.forEach((option, index) => {
        option.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                const nextOption = options[index + 1] || options[0]; // Sélectionne l'option suivante ou revient à la première
                nextOption.focus(); // Déplace le focus sur l'option suivante
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                const prevOption = options[index - 1] || options[options.length - 1]; // Sélectionne l'option précédente ou revient à la dernière
                prevOption.focus(); // Déplace le focus sur l'option précédente
            }
        });
    });
}


// Appelle la fonction initPhotographerPage lors du chargement du script pour la page du photographe
initPhotographerPage();