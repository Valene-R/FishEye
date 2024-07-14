import { LikeObserver } from "../utils/likeObserver.js";

// Crée une instance de LikeObserver
const likeObserver = new LikeObserver();

// Déclare mediaLikesState globalement
const mediaLikesState = {};

/**
 * Classe représentant un média
 */
export class Media {
    constructor(data, heartSVG, photographerTemplate) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        // Utilise l'état sauvegardé dans mediaLikesState si disponible, sinon utilise les données initiales du JSON
        // "mediaLikesState" permet de préserver les likes entre les changements d'option dans le dropdown sans toucher au sessionStorage directement
        this._likes = mediaLikesState[this.id]?.likes || data.likes;
        this.date = data.date;
        this.price = data.price;
        this.photographerName = data.photographerName;
        this.heartSVG = heartSVG;
        // Récupère l'état du like pour ce média depuis mediaLikesState si disponible, sinon initialise à false
        this.isLiked = mediaLikesState[this.id]?.isLiked || false;
        // Initialise la référence au template du photographe pour mettre à jour les likes globaux
        this.photographerTemplate = photographerTemplate;

        // Sauvegarde l'état initial des likes dans mediaLikesState 
        // Permet de s'assurer que chaque média a son état de like correctement sauvegardé dès l'initialisation
        this.saveLikeState();
    }

    /**
     * Getter pour obtenir le nombre de likes
     * @returns {number} Le nombre de likes du média
     */
    get likes() {
        return this._likes;
    }

    /**
     * Setter pour mettre à jour le nombre de likes et l'affichage
     * @param {number} value Le nouveau nombre de likes
     */
    set likes(value) {
        this._likes = value;
        this.updateLikesDisplay();
        this.saveLikeState(); // Sauvegarde l'état après chaque mise à jour
    }

    /**
     * Met à jour l'affichage des likes
     */
    updateLikesDisplay() {
        if (this.likesContainer) {
            this.likesContainer.querySelector('.likes-count').textContent = this._likes;
            this.likesContainer.setAttribute("aria-label", `${this._likes} likes`);
        }
    }

    /**
     * Sauvegarde l'état du like 
     */
    saveLikeState() {
        mediaLikesState[this.id] = {
            likes: this._likes,
            isLiked: this.isLiked
        };
    }

    /**
     * Crée les éléments HTML communs pour les médias
     * @returns {Object} Un objet contenant les éléments HTML communs
     */
    createCommonElements() {
        const article = document.createElement("article");
        article.setAttribute("data-lightbox", "media-item");

        const titleContainer = document.createElement("div");
        titleContainer.className = "title-container";

        const title = document.createElement("h2");
        title.textContent = this.title;

        const likesContainer = document.createElement("div");
        likesContainer.className = "likes-container";
        likesContainer.setAttribute("role", "group");
        likesContainer.setAttribute("aria-label", `${this._likes} likes`);

        const likes = document.createElement("span");
        likes.className = "likes-count";
        likes.textContent = this.likes;
        likes.setAttribute("aria-live", "polite"); // Permet de mettre à jour dynamiquement pour les lecteurs d'écran

        const heartIcon = document.createElement("span");
        heartIcon.className = "heart-icon";
        heartIcon.innerHTML = this.heartSVG;
        heartIcon.setAttribute("aria-label", "likes");
        heartIcon.setAttribute("tabindex", "0"); // Ajoute la navigation clavier
        heartIcon.setAttribute("role", "button"); // Indique qu'il s'agit d'un bouton pour le lecteur d'écran

        if (this.isLiked) {
            heartIcon.classList.add('liked');
        }

        // Ajoute un gestionnaire d'événements pour gérer les clics sur le svg du coeur
        heartIcon.addEventListener("click", (event) => {
            event.stopPropagation(); // Empêche la propagation de l'événement de clic à l'élément parent
            this.handleLike();
        });

        // Ajoute un gestionnaire d'événements pour gérer l'activation via le clavier
        heartIcon.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") { // Vérifie si la touche pressée est "entrée" ou "barre d'espace"
                event.preventDefault(); // Empêche le comportement par défaut de la touche (comme faire défiler la page)
                event.stopPropagation();
                this.handleLike();
            }
        });

        likesContainer.appendChild(likes);
        likesContainer.appendChild(heartIcon);

        titleContainer.appendChild(title);
        titleContainer.appendChild(likesContainer);

        // Stocke la référence à l'élément likesContainer pour les mises à jour ultérieures
        this.likesContainer = likesContainer;

        return { article, titleContainer };
    }

    /**
     * Gère l'événement de clic sur le bouton like
     */
    handleLike() {
        if (!this.isLiked) { // Vérifie si le média n'a pas été liké
            this.likes += 1; // Incrémente les likes en utilisant le setter
            this.isLiked = true; // Met à jour le flag pour indiquer que le média a été liké
            this.photographerTemplate.updateTotalLikes(1); // Met à jour le total des likes du photographe de 1
            this.likesContainer.querySelector(".heart-icon").classList.add("liked");
            this.likesContainer.setAttribute("aria-pressed", "true");

        } else {
            this.likes -= 1;
            this.isLiked = false;
            this.photographerTemplate.updateTotalLikes(-1);
            this.likesContainer.querySelector(".heart-icon").classList.remove("liked");
            this.likesContainer.setAttribute("aria-pressed", "false");
        }
        // Sauvegarde l'état du like après l'avoir mis à jour
        this.saveLikeState(); 

        // Notifie l'observer du changement de like
        likeObserver.notify("like", { id: this.id, likes: this._likes });
    }
}


/**
 * Classe représentant une photo
 * @extends Media
 */
export class Photo extends Media {
    constructor(data, heartSVG, photographerTemplate) {
        super(data, heartSVG, photographerTemplate);
        this.image = data.image;
    }

    /**
     * Crée un élément HTML pour la photo
     * @returns {HTMLElement} L'élément HTML de la photo
     */
    createMediaElement() {
        const { article, titleContainer } = this.createCommonElements();

        const imgLink = document.createElement("a");
        imgLink.href = "#"; // Utilise un href vide pour empêcher la navigation par défaut
        imgLink.setAttribute("aria-label", `${this.title} by ${this.photographerName}, closeup view`);
        imgLink.setAttribute("tabindex", "0"); // Ajoute la navigation clavier

        const img = document.createElement("img");
        img.setAttribute("src", `assets/photographers/media/${this.photographerName}/${this.image}`);
        img.setAttribute("alt", "");
        img.setAttribute("loading", "lazy"); // Ajoute lazy loading à l'image 

        imgLink.appendChild(img);
        article.appendChild(imgLink);
        article.appendChild(titleContainer);

        return article;
    }
}


/**
 * Classe représentant une vidéo
 * @extends Media
 */
export class Video extends Media {
    constructor(data, heartSVG, photographerTemplate) {
        super(data, heartSVG, photographerTemplate);
        this.video = data.video;
    }

    /**
     * Crée un élément HTML pour la vidéo
     * @returns {HTMLElement} L'élément HTML de la vidéo 
     */
    createMediaElement() {
        const { article, titleContainer } = this.createCommonElements();

        const videoLink = document.createElement("a");
        videoLink.href = "#"; // Utilise un href vide pour empêcher la navigation par défaut
        videoLink.setAttribute("aria-label", `${this.title} by ${this.photographerName}, closeup view`);
        videoLink.setAttribute("tabindex", "0"); // Ajoute la navigation clavier

        const video = document.createElement("video");
        video.setAttribute("loading", "lazy"); // Ajoute lazy loading à la vidéo 
        const source = document.createElement("source");
        source.setAttribute("src", `assets/photographers/media/${this.photographerName}/${this.video}`);
        source.setAttribute("type", "video/mp4");
        source.setAttribute("aria-label", "");
        video.appendChild(source);

        videoLink.appendChild(video);
        article.appendChild(videoLink);
        article.appendChild(titleContainer);

        return article;
    }
}


/**
 * Classe représentant une Factory pour Media
 */
export class MediaFactory {
    /**
     * Crée une instance de média
     * @param {Object} data Les données du media
     * @param {string} heartSVG Le contenu du SVG du coeur
     * @param {PhotographerTemplate} photographerTemplate Le template du photographe
     * @returns {Media} Une instance de Photo ou de Video 
     */
    static createMedia(data, heartSVG, photographerTemplate) {
        // Vérifie si les données contiennent une image
        if (data.image) {
            const photo = new Photo(data, heartSVG, photographerTemplate);
            return photo;
        } 
        // Vérifie si les données contiennent une vidéo
        else if (data.video) {
            const video = new Video(data, heartSVG, photographerTemplate);
            return video;
        } 
        // Si les données ne contiennent ni image ni vidéo, lance une erreur
        else {
            throw new Error("Invalid media type");
        }
    }
}