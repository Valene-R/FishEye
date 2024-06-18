export class ApiManager {
    /**
     * Constructeur qui initialise l'instance avec l'URL de base
     * @param {string} baseUrl URL de base pour les requêtes de l'API
     * @param {string} iconBaseUrl URL de base pour les icônes
     */
    constructor(baseUrl, iconBaseUrl) {
        this.baseUrl = baseUrl; 
        this.iconBaseUrl = iconBaseUrl; 
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

    /**
     * Récupère les médias à partir d'un fichier JSON
     * @returns {Promise<Array>} Une promesse qui retourne un tableau de médias si la requête réussit, sinon un tableau vide
     */
    async getMedia() {
        try {
            const response = await fetch(`${this.baseUrl}/photographers.json`);
            const data = await response.json();
            return data.media;
        } catch (error) {
            console.error("Failed to load media:", error);
            return [];
        }
    }

    /**
     * Récupère un fichier SVG à partir d'une URL
     * @param {string} svgName Le nom du fichier SVG
     * @returns {Promise<string>} Une promesse qui retourne le contenu du SVG si la requête réussit
     */
    async getSVG(svgName) {
        try {
            const response = await fetch(`${this.iconBaseUrl}/${svgName}`);
            return await response.text();
        } catch (error) {
            console.error(error);
            return "";
        }
    }
}