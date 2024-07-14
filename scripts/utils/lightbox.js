import { trapFocus } from "./trapFocus.js";

/**
 * Classe représentant une Lightbox pour afficher des médias (images/vidéos)
 */
export class Lightbox {
    // Le constructeur initialise les éléments de la Lightbox et les événements
    constructor(apiManager) {
        this.apiManager = apiManager; // Instance de ApiManager pour charger les SVG
        this.lightbox = document.getElementById("lightbox");
        this.lightboxContent = this.lightbox.querySelector(".lightbox-media");
        this.lightboxCloseBtn = this.lightbox.querySelector(".lightbox-close");
        this.lightboxPrevBtn = this.lightbox.querySelector(".lightbox-prev");
        this.lightboxNextBtn = this.lightbox.querySelector(".lightbox-next");
        this.mainContent = document.querySelector("main");

        this.currentMediaIndex = 0; // Index du média actuel
        this.mediaItems = []; // Tableau des éléments média
        this.lastFocusedElement = null; // Élément qui a ouvert la lightbox

        this.initEvents();
        this.loadSVGs();
    }


    /**
     * Charge les SVG des boutons à partir de l'API
     * @returns {Promise<void>}
     */
    async loadSVGs() {
        try {
            const closeSVG = await this.apiManager.getSVG("close.svg");
            const leftArrowSVG = await this.apiManager.getSVG("leftArrow.svg");
            const rightArrowSVG = await this.apiManager.getSVG("rightArrow.svg");

            // Insère les SVG dans les boutons correspondants
            this.lightboxCloseBtn.innerHTML = closeSVG;
            this.lightboxPrevBtn.innerHTML = leftArrowSVG;
            this.lightboxNextBtn.innerHTML = rightArrowSVG;
        } catch (error) {
            console.error("Failed to load SVG:", error);
        }
    }


    /**
     * Initialise les événements de la Lightbox
     */
    initEvents() {
        this.lightboxCloseBtn.addEventListener("click", () => this.closeLightbox());
        this.lightboxPrevBtn.addEventListener("click", () => this.showPrevMedia());
        this.lightboxNextBtn.addEventListener("click", () => this.showNextMedia());

        // Gestion des événements clavier pour la navigation et la fermeture
        document.addEventListener("keydown", (event) => {
            if (this.lightbox.getAttribute("aria-hidden") === "false") {
                switch (event.key) {
                    case "Escape":
                        this.closeLightbox(); // Ferme la Lightbox avec la touche "échap"
                        break;
                    case "ArrowRight":
                        event.preventDefault(); 
                        this.showNextMedia(); // Affiche le média suivant avec la flèche droite
                        break;
                    case "ArrowLeft":
                        event.preventDefault();
                        this.showPrevMedia(); // Affiche le média précédent avec la flèche gauche
                        break;
                    case "Tab":
                        trapFocus(event, this.lightbox); // Gère le focus à l'intérieur de la lightbox
                        break;
                }
            }
        });
    }


    /**
     * Ouvre la Lightbox et affiche le média correspondant à l'index
     * @param {number} index L'index du média à afficher
     */
    openLightbox(index) {
        this.lastFocusedElement = this.mediaItems[index].querySelector("a"); // Sauvegarde l'élément ayant le focus avant ouverture

        this.currentMediaIndex = index;
        this.updateLightboxContent();
        this.lightbox.setAttribute("aria-hidden", "false"); // Rend la Lightbox visible
        this.lightbox.style.display = "flex"; // Affiche la lightbox
        this.lightbox.setAttribute("aria-live", "polite"); 

        // Masque les éléments en arrière-plan de l'accessibilité
        this.mainContent.setAttribute("aria-hidden", "true");

        // Désactive le défilement de la page principale
        document.body.style.overflow = "hidden";

        // Déplace le focus sur le bouton de fermeture de la lightbox
        this.lightboxCloseBtn.focus();
    }


    /**
     * Ferme la Lightbox
     */
    closeLightbox() {
        this.lightbox.setAttribute("aria-hidden", "true"); // Cache la Lightbox
        this.lightbox.style.display = "none"; // Masque la lightbox

        // Rend les éléments en arrière-plan accessibles
        this.mainContent.removeAttribute("aria-hidden");

        // Réactive le défilement de la page principale
        document.body.style.overflow = "auto";

        // Vérifie si lastFocusedElement n'est pas null avant de déplacer le focus sur l'élément qui a ouvert la lightbox
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }


    /**
     * Met à jour le contenu de la Lightbox avec le média actuel
     */
    updateLightboxContent() {
        // Obtient le média actuel et son titre
        const mediaItem = this.mediaItems[this.currentMediaIndex]; // Récupère le média actuel
        const mediaContent = mediaItem.querySelector("a").innerHTML;
        const mediaTitle = mediaItem.querySelector("h2").textContent;
        
        // Génère des identifiants uniques pour le titre et la description
        const uniqueId = `media-title-${this.currentMediaIndex}`;
        const descId = `media-desc-${this.currentMediaIndex}`;
    
        // Met à jour le contenu de la lightbox avec les médias sélectionnés
        this.lightboxContent.innerHTML = `
            <figure class="media-content">
                ${mediaContent}
                <figcaption id="${uniqueId}" class="media-title" aria-live="polite">
                    <h2>${mediaTitle}</h2>
                </figcaption>
            </figure>
        `;
    
        // Sélectionne l'image ou la vidéo dans le contenu de la lightbox
        const imgOrVideo = this.lightboxContent.querySelector("img, video");
        if (imgOrVideo) {
            if (imgOrVideo.matches("img")) {
                // Ajoute un texte alternatif pour les images
                imgOrVideo.setAttribute("alt", mediaTitle);
                imgOrVideo.setAttribute("tabindex", "0"); // Rend l'image focusable
            } else if (imgOrVideo.matches("video")) {
                // Ajoute des attributs de contrôle et d'accessibilité pour les vidéos
                imgOrVideo.setAttribute("controls", "");
                imgOrVideo.setAttribute("aria-labelledby", uniqueId); // Associe le titre
                imgOrVideo.setAttribute("aria-describedby", descId); // Associe la description
                imgOrVideo.setAttribute("tabindex", "0"); // Rend la vidéo focusable
    
                // Ajoute un élément de description pour les lecteurs d'écran
                const description = document.createElement("div");
                description.id = descId;
                description.className = "sr-only"; // Masque cet élément visuellement
                description.innerText = `Video titled ${mediaTitle}`;
    
                this.lightboxContent.appendChild(description);
            }
            // Met le focus sur l'élément média
            this.lightboxContent.querySelector(".media-content").focus();
        }

        // Utilise un délai pour s'assurer que le DOM est prêt avant de déplacer le focus
        setTimeout(() => {
            if (imgOrVideo) {
                imgOrVideo.focus();
            }
        }, 100);
    }    


    /**
     * Affiche le média suivant
     */
    showNextMedia() {
        // Utilise le modulo (%) permettant de créer une boucle continue 
        this.currentMediaIndex = (this.currentMediaIndex + 1) % this.mediaItems.length; // Met à jour l'index
        this.updateLightboxContent(); // Met à jour le contenu de la Lightbox avec le nouvel index
    }


    /**
     * Affiche le média précédent
     */
    showPrevMedia() {
        this.currentMediaIndex = (this.currentMediaIndex - 1 + this.mediaItems.length) % this.mediaItems.length;
        this.updateLightboxContent();
    }


    /**
     * Initialise la Lightbox avec les éléments média
     * @param {HTMLElement[]} mediaItems Les éléments média à afficher dans la Lightbox
     */
    init(mediaItems) {
        this.mediaItems = mediaItems; // Stocke les éléments média
        this.mediaItems.forEach((item, index) => {
            const link = item.querySelector("a"); // Sélectionne le lien de chaque élément média

            // Gére l'ouverture de la Lightbox via un clic
            link.addEventListener("click", (event) => {
                event.preventDefault();
                this.openLightbox(index); // Ouvre la Lightbox avec l'index de l'élément média cliqué
            });

            // Gére l'ouverture de la Lightbox via le clavier
            link.addEventListener("keydown", (event) => {
                if ((event.key === "Enter" || event.key === " ") && document.activeElement === link) {
                    event.preventDefault(); // Empêche le comportement par défaut de la touche (comme faire défiler la page)
                    this.openLightbox(index); // Ouvre la Lightbox avec l'index de l'élément média activé
                }
            });
        });
    }
}