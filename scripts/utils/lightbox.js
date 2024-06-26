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

    // Charge les SVG des boutons à partir de l'API
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

    // Initialise les événements de la Lightbox
    initEvents() {
        this.lightboxCloseBtn.addEventListener("click", () => this.closeLightbox()); // Ferme la Lightbox au clic
        this.lightboxPrevBtn.addEventListener("click", () => this.showPrevMedia()); // Affiche le média précédent au clic
        this.lightboxNextBtn.addEventListener("click", () => this.showNextMedia()); // Affiche le média suivant au clic

        // Gestion des événements clavier pour la navigation et la fermeture
        document.addEventListener("keydown", (event) => {
            if (this.lightbox.getAttribute("aria-hidden") === "false") {
                if (event.key === "Escape") {
                    this.closeLightbox(); // Ferme la Lightbox avec la touche "échap"
                } else if (event.key === "ArrowRight") {
                    this.showNextMedia(); // Affiche le média suivant avec la flèche droite
                } else if (event.key === "ArrowLeft") {
                    this.showPrevMedia(); // Affiche le média précédent avec la flèche gauche
                } else if (event.key === "Tab") {
                    this.trapFocus(event);  // Gère le focus à l'intérieur de la lightbox
                }
            }
        });
    }

    // Piège le focus à l'intérieur de la Lightbox pour l'accessibilité
    trapFocus(event) {
        const focusableElements = this.lightbox.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus(); // Déplace le focus sur le dernier élément
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus(); // Déplace le focus sur le premier élément
            }
        }
    }

    // Ouvre la Lightbox et affiche le média correspondant à l'index
    openLightbox(index) {
        this.lastFocusedElement = document.activeElement; // Stocke l'élément qui a ouvert la lightbox
        this.currentMediaIndex = index;
        this.updateLightboxContent();
        this.lightbox.setAttribute("aria-hidden", "false"); // Rend la Lightbox visible
        this.lightbox.style.display = "flex"; // Affiche la lightbox
       
        // Masque les éléments en arrière-plan de l'accessibilité
        this.mainContent.setAttribute("aria-hidden", "true");

        // Déplace le focus sur le bouton de fermeture de la lightbox
        this.lightboxCloseBtn.focus();
    }

    // Ferme la Lightbox
    closeLightbox() {
        this.lightbox.setAttribute("aria-hidden", "true"); // Cache la Lightbox
        this.lightbox.style.display = "none"; // Masque la lightbox
        
        // Rend les éléments en arrière-plan accessibles
        this.mainContent.removeAttribute("aria-hidden");

        // Déplace le focus sur l'élément qui a ouvert la lightbox
        this.lastFocusedElement.focus(); 
    }

    // Met à jour le contenu de la Lightbox avec le média actuel
    updateLightboxContent() {
        const mediaItem = this.mediaItems[this.currentMediaIndex]; // Récupère le média actuel
        const mediaContent = mediaItem.querySelector("a").innerHTML; 
        const mediaTitle = mediaItem.querySelector("h2").textContent;

        this.lightboxContent.innerHTML = `
            <div class="media-content">
                ${mediaContent}
            </div>
            <div class="media-title">
                <h2>${mediaTitle}</h2>
            </div>
        `;

        // Ajoute l'attribut alt aux images et aria-label aux vidéos
        const imgOrVideo = this.lightboxContent.querySelector("img, video");
        if (imgOrVideo) {
            if (imgOrVideo.matches("img")) {
                imgOrVideo.setAttribute("alt", mediaTitle); 
            } else if (imgOrVideo.matches("video")) {
                imgOrVideo.setAttribute("aria-label", mediaTitle); 
            }
        }
    }

    // Affiche le média suivant
    showNextMedia() {
        // Utilise le modulo (%) permettant de créer une boucle continue 
        this.currentMediaIndex = (this.currentMediaIndex + 1) % this.mediaItems.length; // Met à jour l'index
        this.updateLightboxContent(); // Met à jour le contenu de la Lightbox avec le nouvel index
    }

    // Affiche le média précédent
    showPrevMedia() {
        this.currentMediaIndex = (this.currentMediaIndex - 1 + this.mediaItems.length) % this.mediaItems.length;
        this.updateLightboxContent();
    }

    // Initialise la Lightbox avec les éléments média
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