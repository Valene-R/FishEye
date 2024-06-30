/**
 * Trie les médias en fonction du critère sélectionné
 * @param {Array} mediaArray  Le tableau des médias à trier
 * @param {string} sortBy  Le critère de tri ("popularité", "date" ou "titre")
 * @returns {Array}  Le tableau trié des médias
 */
export function sortMedia(mediaArray, sortBy) {
    switch (sortBy) {
        case "popularité":
            return mediaArray.sort((a, b) => b.likes - a.likes); // Trie par nombre de likes décroissant
        case "date":
            return mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trie par date décroissante
        case "titre":
            return mediaArray.sort((a, b) => a.title.localeCompare(b.title)); // Trie par titre alphabétique
        default:
            return mediaArray;
    }
}