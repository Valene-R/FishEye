/**
 * Classe représentant un observateur de "like"
 */
export class LikeObserver {
    constructor() {
        this.events = {}; // Stocke les événements et leurs écouteurs
    }

    /**
     * Abonne un écouteur à un événement
     * @param {string} event Le nom de l'événement
     * @param {function} listener La fonction à appeler lorsque l'événement est déclenché
     */
    subscribe(event, listener) {
        if (!this.events[event]) {
            this.events[event] = []; // Crée un tableau pour les écouteurs de cet événement s'il n'existe pas
        }
        this.events[event].push(listener); // Ajoute l'écouteur à la liste des écouteurs de cet événement
    }

    /**
     * Désabonne un écouteur d'un événement 
     * @param {string} event Le nom de l'événement
     * @param {function} listener La fonction à supprimer de la liste des écouteurs 
     */
    unsubscribe(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener); // Filtre les écouteurs pour enlever celui spécifié
        }
    }

    /**
     * Notifie tous les écouteurs d'un événement
     * @param {string} event Le nom de l'événement
     * @param {object} args Les arguments à passer aux écouteurs, représentant les informations de "like"
     * @param {number} args.id L'identifiant de l'élément liké
     * @param {number} args.likes Le nombre de likes de l'élément
     */
    notify(event, args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(args)); // Appelle chaque écouteur avec les arguments fournis
        }
    }
}