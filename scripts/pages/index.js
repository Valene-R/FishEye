import { PhotographerTemplate } from "../templates/photographer.js";

/**
 * Récupére les données des photographes à partir d'un fichier JSON
 * @returns {Promise<Array>} Une promesse qui retourne un tableau de photographes si la requête réussit
 */
async function getPhotographers() {
    try {
        // Effectue une requête HTTP GET pour obtenir les données
        const response = await fetch('data/photographers.json');
        const data = await response.json();
        return data.photographers;  
    } catch (error) {
        // Si échec de la requête, enregistre l'erreur dans la console
        console.error("Erreur lors du chargement des données des photographes", error);
        return [];  // Retourne un tableau vide en cas d'erreur
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
    photographers.forEach((photographer) => {
         // Instancie la classe PhotographerTemplate avec les données du photographe
        const photographerModel = new PhotographerTemplate(photographer);
         // Crée l'élément DOM pour le photographe en utilisant la méthode définie dans la classe PhotographerTemplate
        const userCardDOM = photographerModel.getUserCardDOM();
        // Ajoute l'élément du photographe au fragment, pas directement au DOM principal
        fragment.appendChild(userCardDOM);
    });

    // Ajoute le fragment complet à la section des photographes dans le DOM principal: permet de minimiser les modifications du DOM et optimise les performances
    photographersSection.appendChild(fragment);
}


/**
 * Initialise pour charger les données et mettre à jour le DOM
 */
async function init() {
    // Récupère les données des photographes
    const photographers = await getPhotographers();
    displayData(photographers);
}
 
// Appelle la fonction init lors du chargement du script
init();
    
