/**
 * Utility functions for filtering and sorting movies
 */

/**
 * Filter movies based on criteria
 * @param {Array} movies - Array of movie objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered movies
 */
export const filterMoviesOnClient = (movies, filters) => {
  if (!movies || movies.length === 0) return [];
  
  return movies.filter((movie) => {
    // Exclude adult content
    if (movie.adult === true) return false;

    // Genre filter
    if (filters.genres && filters.genres.length > 0) {
      const hasMatchingGenre = movie.genre_ids?.some((genreId) =>
        filters.genres.includes(genreId)
      );
      if (!hasMatchingGenre) return false;
    }

    // Year filter
    if (filters.yearFrom || filters.yearTo) {
      const movieYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : null;
      if (!movieYear) return false;

      if (filters.yearFrom && movieYear < parseInt(filters.yearFrom, 10))
        return false;
      if (filters.yearTo && movieYear > parseInt(filters.yearTo, 10))
        return false;
    }

    // Rating filter
    if (filters.ratingMin && movie.vote_average < parseFloat(filters.ratingMin))
      return false;
    if (filters.ratingMax && movie.vote_average > parseFloat(filters.ratingMax))
      return false;

    return true;
  });
};

/**
 * Sort movies by specified criteria
 * @param {Array} movies - Array of movie objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted movies
 */
export const sortMoviesOnClient = (movies, sortBy) => {
  if (!movies || movies.length === 0) return [];
  
  const sortedMovies = [...movies];

  const sortFunctions = {
    'popularity.desc': (a, b) => (b.popularity || 0) - (a.popularity || 0),
    'popularity.asc': (a, b) => (a.popularity || 0) - (b.popularity || 0),
    'vote_average.desc': (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
    'vote_average.asc': (a, b) => (a.vote_average || 0) - (b.vote_average || 0),
    'release_date.desc': (a, b) => 
      new Date(b.release_date || 0) - new Date(a.release_date || 0),
    'release_date.asc': (a, b) => 
      new Date(a.release_date || 0) - new Date(b.release_date || 0),
    'title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
    'title.desc': (a, b) => (b.title || '').localeCompare(a.title || ''),
  };

  const sortFunction = sortFunctions[sortBy];
  
  return sortFunction ? sortedMovies.sort(sortFunction) : sortedMovies;
};

/**
 * Paginate array of items
 * @param {Array} items - Items to paginate
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Paginated results with items and total pages
 */
export const paginateItems = (items, currentPage, itemsPerPage) => {
  if (!items || items.length === 0) {
    return { items: [], totalPages: 0 };
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return {
    items: paginatedItems,
    totalPages,
  };
};