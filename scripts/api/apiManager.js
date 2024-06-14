export class ApiManager {
    /**
     * Constructeur qui initialise l'instance avec l'URL de base
     * @param {string} baseUrl URL de base pour les requêtes de l'API
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;  
    }

    /**
     * Récupère les données des photographes à partir d'un fichier JSON
     * @returns {Promise<Array>} Une promesse qui retourne un tableau de photographes si la requête réussit, sinon un tableau vide
     */
    async getPhotographers() {
        try {
            // Effectue une requête HTTP GET pour obtenir les données
            const response = await fetch(`${this.baseUrl}/photographers.json`);
            const data = await response.json();
            return data.photographers;
        } catch (error) {
            // Si échec de la requête, enregistre l'erreur dans la console
            console.error("Failed to load photographers:", error);
            return []; // Retourne un tableau vide en cas d'erreur
        }
    }
}