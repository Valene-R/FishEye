/**
 * Classe représentant un média
 */
export class Media {
    constructor(data, heartSVG, photographerTemplate) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this._likes = data.likes; // Le nombre de likes du média (propriété privé)
        this.date = data.date;
        this.price = data.price;
        this.photographerName = data.photographerName;
        this.heartSVG = heartSVG;
        this.isLiked = false; // Flag binaire (boolean) : vérifie si le média a déjà été liké ou non
        this.photographerTemplate = photographerTemplate; // Référence au template du photographe
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

        // Ajoute un gestionnaire d'événements pour gérer les clics sur le svg du coeur
        heartIcon.addEventListener("click", (event) => {
            event.stopPropagation(); // Empêche la propagation de l'événement de clic à l'élément parent
            this.handleLike();
        });

        // Ajoute un gestionnaire d'événements pour gérer l'activation via le clavier
        heartIcon.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") { // Vérifie si la touche pressée est "entrée" ou "barre d'espace"
                event.preventDefault(); // Empêche le comportement par défaut de la touche (comme faire défiler la page)
                event.stopPropagation(); // Empêche la propagation de l'événement de touche à l'élément parent
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
        }
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

        const video = document.createElement("video");
        video.setAttribute("controls", "");
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
            return new Photo(data, heartSVG, photographerTemplate);
        } 
        // Vérifie si les données contiennent une vidéo
        else if (data.video) {
            return new Video(data, heartSVG, photographerTemplate);
        } 
        // Si les données ne contiennent ni image ni vidéo, lance une erreur
        else {
            throw new Error("Invalid media type");
        }
    }
}