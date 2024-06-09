/**
 * Représente un photographe
 */
export class PhotographerTemplate {
    constructor(data) {
        // Initialise l'instance avec les données fournies
        const { name, portrait, city, country, tagline, price } = data;
        this.name = name;
        this.portrait = portrait;
        this.city = city;
        this.country = country;
        this.tagline = tagline;
        this.price = price;
        this.picture = `assets/photographers/idPhotos/${portrait}`;
    }

    /**
     * Crée et retourne un élément DOM représentant le photographe
     * @returns {HTMLElement} L'élément "article" contenant les détails du photographe
     */
    getUserCardDOM() {
        const article = document.createElement("article");
        const img = document.createElement("img");
        img.setAttribute("src", this.picture);
        img.setAttribute("alt", `Portrait de ${this.name}`); // Ajoute un attribut "alt" pour l'accessibilité

        const h2 = document.createElement("h2");
        h2.textContent = this.name;

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

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(info);

        return article;
    }
}