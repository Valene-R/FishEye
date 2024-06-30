/**
 * Représente un photographe
 */
export class PhotographerTemplate {
    constructor(data, heartSVG, initialTotalLikes) {
        // Initialise l'instance avec les données fournies
        const { name, portrait, city, country, tagline, price, id } = data;
        this.name = name;
        this.portrait = portrait;
        this.city = city;
        this.country = country;
        this.tagline = tagline;
        this.price = price;
        this.id = id;
        this.picture = `assets/photographers/idPhotos/${portrait}`;
        this.heartSVG = heartSVG;

        // Récupère les likes sauvegardés ou initialise avec le total initial
        const savedLikes = sessionStorage.getItem(`photographer_${this.id}_likes`);
        this.totalLikes = savedLikes && !isNaN(savedLikes) ? parseInt(savedLikes, 10) : initialTotalLikes;
    }

    /**
     * Crée et retourne un élément DOM représentant le photographe
     * @returns {HTMLElement} L'élément "article" contenant les détails du photographe
     */
    getUserCardDOM() {
        const article = document.createElement("article");

        // Crée un lien vers la page du photographe
        const link = document.createElement("a");
        link.setAttribute("href", `photographer.html?id=${this.id}`);  // Utilise l'ID du photographe pour créer un lien unique visible dans l'url 
        link.setAttribute("aria-label", this.name); // Ajoute un "aria-label" pour améliorer l'accessibilité

        // Ajoute l'image du photographe
        const img = document.createElement("img");
        img.setAttribute("src", this.picture);
        img.setAttribute("alt", ""); // "alt" vide car l'information est déjà dans le "aria-label" du lien
        link.appendChild(img);

        // Ajoute le nom du photographe
        const h2 = document.createElement("h2");
        h2.textContent = this.name;
        link.appendChild(h2); // Inclut le h2 dans le lien pour améliorer l'accessibilité

        // Crée un conteneur pour les informations du photographe
        const info = document.createElement("div");
        info.className = "photographer-info";

        // Ajoute la ville et le pays du photographe
        // Concaténation de la ville et du pays dans le même élément <p>
        const locationInfo = document.createElement("p");
        locationInfo.textContent = `${this.city}, ${this.country}`; 
        info.appendChild(locationInfo);

        // Ajoute la tagline du photographe
        const taglineInfo = document.createElement("p");
        taglineInfo.textContent = this.tagline;
        info.appendChild(taglineInfo);

        // Ajoute le prix du photographe
        const priceInfo = document.createElement("p");
        priceInfo.textContent = `${this.price}€/jour`;
        info.appendChild(priceInfo);

        // Ajoute tous les éléments dans l'article
        article.appendChild(link); // Ajoute le lien (qui contient l'image) à l'article
        article.appendChild(info);

        return article;
    }

    /**
     * Crée et retourne un élément DOM représentant le photographe pour la page spécifique du photographe
     * @returns {DocumentFragment} Le fragment contenant les détails du photographe
     */
     getPhotographerPageDOM() {
        const fragment = document.createDocumentFragment();

        // Crée le profil du photographe
        const photographerProfile = document.createElement("div");
        photographerProfile.className = "photographer-profile";

        // Le nom du photographe
        const name = document.createElement("h1");
        name.className = "header-title";
        name.textContent = this.name;

        // Crée un conteneur pour les informations du photographe
        const info = document.createElement("div");
        info.className = "photograph-info";

         // La ville et le pays du photographe
        const location = document.createElement("p");
        location.textContent = `${this.city}, ${this.country}`;

        // La tagline du photographe
        const tagline = document.createElement("p");
        tagline.textContent = this.tagline;

        info.appendChild(location);
        info.appendChild(tagline);
        photographerProfile.appendChild(name);
        photographerProfile.appendChild(info);

        // Sélectionne le bouton "Contactez-moi" dans le DOM
        const contactBtn = document.querySelector(".contact_button");

        // L'image du photographe
        const img = document.createElement("img");
        img.setAttribute("src", this.picture);
        img.setAttribute("alt", this.name);

        // Crée le petit encart avec le prix et les likes
        const infoBarFooter = document.createElement("aside");
        infoBarFooter.className = "photographer-footer";

        // Le prix journalier
        const price = document.createElement("p");
        price.textContent = `${this.price}€ / jour`;

        // Crée un conteneur pour les likes totaux
        const likesContainer = document.createElement("div");
        likesContainer.className = "total-likes";
        likesContainer.innerHTML = `
            <span class="total-likes-count">${this.totalLikes}</span>
            <span class="heart-icon">${this.heartSVG}</span>
        `;

        price.appendChild(likesContainer);
        infoBarFooter.appendChild(price);

        // Ajoute les éléments au fragment
        fragment.appendChild(photographerProfile);
        fragment.appendChild(contactBtn);
        fragment.appendChild(img);
        fragment.appendChild(infoBarFooter);

        // Stocke la référence au conteneur des likes pour les mises à jour ultérieures
        this.likesContainer = likesContainer;

        return fragment;
    }

    /**
     * Met à jour le nombre total de likes
     * @param {number} likes Le nombre de likes à ajouter
     */
    updateTotalLikes(likes) {
        this.totalLikes += likes;
        sessionStorage.setItem(`photographer_${this.id}_likes`, this.totalLikes); // Sauvegarde les likes dans le sessionStorage
        
        if (this.likesContainer) {
            this.likesContainer.querySelector('.total-likes-count').textContent = this.totalLikes;
        }
    }
}