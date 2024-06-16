/**
 * Représente un photographe
 */
export class PhotographerTemplate {
    constructor(data) {
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
    }

    /**
     * Crée et retourne un élément DOM représentant le photographe
     * @returns {HTMLElement} L'élément "article" contenant les détails du photographe
     */
    getUserCardDOM() {
        const article = document.createElement("article");

        const link = document.createElement("a");
        link.setAttribute("href", `photographer.html?id=${this.id}`);  // Utilise l'ID du photographe pour créer un lien unique visible dans l'url 
        link.setAttribute("aria-label", this.name); // Ajoute un "aria-label" pour améliorer l'accessibilité

        const img = document.createElement("img");
        img.setAttribute("src", this.picture);
        img.setAttribute("alt", ""); // "alt" vide car l'information est déjà dans le "aria-label" du lien
        link.appendChild(img);

        const h2 = document.createElement("h2");
        h2.textContent = this.name;
        link.appendChild(h2); // Inclut le h2 dans le lien pour améliorer l'accessibilité

        const info = document.createElement("div");
        info.className = "photographer-info";

        // Concaténation de la ville et du pays dans le même élément <p>
        const locationInfo = document.createElement("p");
        locationInfo.textContent = `${this.city}, ${this.country}`; 
        info.appendChild(locationInfo);

        const taglineInfo = document.createElement("p");
        taglineInfo.textContent = this.tagline;
        info.appendChild(taglineInfo);

        const priceInfo = document.createElement("p");
        priceInfo.textContent = `${this.price}€/jour`;
        info.appendChild(priceInfo);

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

        const photographerProfile = document.createElement("div");
        photographerProfile.className = "photographer-profile";

        const name = document.createElement("h1");
        name.className = "header-title";
        name.textContent = this.name;

        const info = document.createElement("div");
        info.className = "photograph-info";

        const location = document.createElement("p");
        location.textContent = `${this.city}, ${this.country}`;

        const tagline = document.createElement("p");
        tagline.textContent = this.tagline;

        info.appendChild(location);
        info.appendChild(tagline);
        photographerProfile.appendChild(name);
        photographerProfile.appendChild(info);

        // Sélectionne le bouton "Contactez-moi" dans le DOM
        const contactBtn = document.querySelector(".contact_button");

        const img = document.createElement("img");
        img.setAttribute("src", this.picture);
        img.setAttribute("alt", this.name);

        const infoBarFooter = document.createElement("aside");
        infoBarFooter.className = "photographer-footer";

        const price = document.createElement("p");
        price.textContent = `${this.price}€ / jour`;

        infoBarFooter.appendChild(price);

        // Ajoute les éléments au fragment
        fragment.appendChild(photographerProfile);
        fragment.appendChild(contactBtn);
        fragment.appendChild(img);
        fragment.appendChild(infoBarFooter);

        return fragment;
    }
}