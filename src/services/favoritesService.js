import {
  getFavoriteMovies,
  addToFavorites,
  removeFromFavorites,
  isMovieFavorite,
  authStorage,
} from "./authService";

export async function getFavorites(page = 1) {
  const sessionId = authStorage.getSessionId();
  if (!sessionId) {
    throw new Error("User not authenticated");
  }
  return await getFavoriteMovies(sessionId, page);
}

export async function addMovieToFavorites(movie) {
  const sessionId = authStorage.getSessionId();
  if (!sessionId) {
    throw new Error("User not authenticated");
  }

  const result = await addToFavorites(sessionId, movie.id);

  if (result.success) {
    // Centralize counter update to dispatch change event
    setFavoritesCount(getFavoritesCount() + 1);
  }

  return result;
}

export async function removeMovieFromFavorites(movieId) {
  const sessionId = authStorage.getSessionId();
  if (!sessionId) {
    throw new Error("User not authenticated");
  }

  const result = await removeFromFavorites(sessionId, movieId);

  if (result.success) {
    const count = Math.max(0, getFavoritesCount() - 1);
    // Centralize counter update to dispatch change event
    setFavoritesCount(count);
  }

  return result;
}

export async function toggleMovieFavorite(movie, currentIsFavorite) {
  if (currentIsFavorite) {
    return await removeMovieFromFavorites(movie.id);
  } else {
    return await addMovieToFavorites(movie);
  }
}

export async function checkIsFavorite(movieId) {
  const sessionId = authStorage.getSessionId();
  if (!sessionId) {
    return false;
  }

  return await isMovieFavorite(sessionId, movieId);
}

export function getFavoritesCount() {
  const count = localStorage.getItem("favorites_count");
  return count ? parseInt(count, 10) : 0;
}

export function setFavoritesCount(count) {
  localStorage.setItem("favorites_count", count.toString());
  try {
    // Notify listeners in-app (Navbar badge, etc.)
    window.dispatchEvent(
      new CustomEvent("favoritesCountUpdated", { detail: { count } })
    );
  } catch (_) {
    // no-op for SSR/tests
  }
}

export function clearFavoritesData() {
  localStorage.removeItem("favorites_count");
  try {
    window.dispatchEvent(
      new CustomEvent("favoritesCountUpdated", { detail: { count: 0 } })
    );
  } catch (_) {
    // ignore dispatch errors (e.g., SSR/tests)
  }
}
