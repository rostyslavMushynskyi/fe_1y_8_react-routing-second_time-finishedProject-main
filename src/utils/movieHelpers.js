/**
 * Utility functions for movie data formatting
 */

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Get full URL for movie poster
 * @param {string} posterPath - Path to poster from TMDB API
 * @param {string} size - Image size (w500, w780, original)
 * @returns {string|null} Full URL or null if no poster
 */
export const getPosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

/**
 * Get backdrop image URL
 * @param {string} backdropPath - Path to backdrop from TMDB API
 * @param {string} size - Image size (w780, w1280, original)
 * @returns {string|null} Full URL or null if no backdrop
 */
export const getBackdropUrl = (backdropPath, size = 'w1280') => {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
};

/**
 * Extract year from date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string|number} Year or "Невідомо" if invalid
 */
export const getYear = (dateString) => {
  if (!dateString) return "Невідомо";
  const year = new Date(dateString).getFullYear();
  return isNaN(year) ? "Невідомо" : year;
};

/**
 * Format movie rating to one decimal place
 * @param {number} rating - Rating from 0-10
 * @returns {string} Formatted rating or "N/A"
 */
export const formatRating = (rating) => {
  if (!rating || rating === 0) return "N/A";
  return (Math.round(rating * 10) / 10).toFixed(1);
};

/**
 * Format runtime in minutes to hours and minutes
 * @param {number} minutes - Runtime in minutes
 * @returns {string} Formatted runtime (e.g., "2год 15хв")
 */
export const formatRuntime = (minutes) => {
  if (!minutes || minutes === 0) return "Невідомо";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}хв`;
  if (mins === 0) return `${hours}год`;
  return `${hours}год ${mins}хв`;
};

/**
 * Format large numbers with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1.5M", "250K")
 */
export const formatNumber = (num) => {
  if (!num || num === 0) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return num.toString();
};

/**
 * Get movie status in Ukrainian
 * @param {string} status - Movie status from TMDB
 * @returns {string} Localized status
 */
export const getMovieStatus = (status) => {
  const statusMap = {
    'Released': 'Вийшов',
    'Post Production': 'Пост-продакшн',
    'In Production': 'У виробництві',
    'Rumored': 'Анонсовано',
    'Planned': 'Заплановано',
    'Canceled': 'Скасовано',
  };
  
  return statusMap[status] || status;
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};