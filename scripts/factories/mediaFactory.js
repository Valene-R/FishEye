/**
 * Classe représentant un média
 */
export class Media {
    constructor(data, heartSVG) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
        this.photographerName = data.photographerName;
        this.heartSVG = heartSVG;
    }

    /**
     * Crée les éléments HTML communs pour les médias
     * @returns {Object} Un objet contenant les éléments HTML communs
     */
    createCommonElements() {
        const article = document.createElement("article");

        const titleContainer = document.createElement("div");
        titleContainer.className = "title-container";

        const title = document.createElement("h2");
        title.textContent = this.title;

        const likesContainer = document.createElement("div");
        likesContainer.className = "likes-container";
        likesContainer.setAttribute("role", "img");
        likesContainer.setAttribute("aria-label", `${this.likes} likes`);

        const likes = document.createElement("span");
        likes.className = "likes-count";
        likes.textContent = this.likes;

        const heartIcon = document.createElement("span");
        heartIcon.className = "heart-icon";
        heartIcon.innerHTML = this.heartSVG;
        heartIcon.setAttribute("aria-label", "likes");

        likesContainer.appendChild(likes);
        likesContainer.appendChild(heartIcon);

        titleContainer.appendChild(title);
        titleContainer.appendChild(likesContainer);

        return { article, titleContainer };
    }
}

/**
 * Classe représentant une photo
 * @extends Media
 */
export class Photo extends Media {
    constructor(data, heartSVG) {
        super(data, heartSVG);
        this.image = data.image;
    }

    /**
     * Crée un élément HTML pour la photo
     * @returns {HTMLElement} L'élément HTML de la photo
     */
    createMediaElement() {
        const { article, titleContainer } = this.createCommonElements();

        const imgLink = document.createElement("a");
        imgLink.href = `assets/photographers/media/${this.photographerName}/${this.image}`;
        imgLink.setAttribute("aria-label", `${this.title} by ${this.photographerName}, closeup view`);

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
    constructor(data, heartSVG) {
        super(data, heartSVG);
        this.video = data.video;
    }

    /**
     * Crée un élément HTML pour la vidéo
     * @returns {HTMLElement} L'élément HTML de la vidéo 
     */
    createMediaElement() {
        const { article, titleContainer } = this.createCommonElements();

        const videoLink = document.createElement("a");
        videoLink.href = `assets/photographers/media/${this.photographerName}/${this.video}`;
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
     * @returns {Media} Une instance de Photo ou de Video 
     */
    static createMedia(data, heartSVG) {
        // Vérifie si les données contiennent une image
        if (data.image) {
            return new Photo(data, heartSVG);
        } 
        // Vérifie si les données contiennent une vidéo
        else if (data.video) {
            return new Video(data, heartSVG);
        } 
        // Si les données ne contiennent ni image ni vidéo, lance une erreur
        else {
            throw new Error("Invalid media type");
        }
    }
}
