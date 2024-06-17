/**
 * Classe représentant un média
 */
export class Media {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
        this.photographerName = data.photographerName;  
    }
}

/**
 * Classe représentant une photo
 * @extends Media
 */
export class Photo extends Media {
    constructor(data) {
        super(data);
        this.image = data.image;
    }

    /**
     * Crée un élément HTML pour la photo
     * @returns {HTMLElement} L'élément HTML de la photo
     */
    createMediaElement() {
        const article = document.createElement("article");

        const imgLink = document.createElement("a");
        imgLink.href = `assets/photographers/media/${this.photographerName}/${this.image}`;
        imgLink.setAttribute("aria-label", `${this.title} by ${this.photographerName}, closeup view`);

        const img = document.createElement("img");
        img.setAttribute("src", `assets/photographers/media/${this.photographerName}/${this.image}`);
        img.setAttribute("alt", "");

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
        heartIcon.innerHTML = heartSVG;
        heartIcon.setAttribute("aria-label", "likes");

        likesContainer.appendChild(likes);
        likesContainer.appendChild(heartIcon);

        titleContainer.appendChild(title);
        titleContainer.appendChild(likesContainer);

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
    constructor(data) {
        super(data);
        this.video = data.video;
    }

    /**
     * Crée un élément HTML pour la vidéo
     * @returns {HTMLElement} L'élément HTML de la vidéo 
     */
    createMediaElement() {
        const article = document.createElement("article");

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
        heartIcon.innerHTML = heartSVG;
        heartIcon.setAttribute("aria-label", "likes");

        likesContainer.appendChild(likes);
        likesContainer.appendChild(heartIcon);

        titleContainer.appendChild(title);
        titleContainer.appendChild(likesContainer);

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
     * @returns {Media} Une instance de Photo ou de Video 
     */
    static createMedia(data) {
        if (data.image) {
            return new Photo(data);
        } else if (data.video) {
            return new Video(data);
        } else {
            throw new Error("Invalid media type");
        }
    }
}


/**
 * Récupère un fichier SVG à partir d'une URL
 * @param {string} url L'URL du fichier SVG
 * @returns {Promise<string>} Une promesse qui retourne le contenu du SVG si la requête réussit 
 */
async function getHeartSVG(url) {
    const response = await fetch(url);
    return await response.text();
}

const heartSVG = await getHeartSVG("assets/icons/heart.svg");