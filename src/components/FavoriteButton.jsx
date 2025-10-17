import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import {
  checkIsFavorite,
  toggleMovieFavorite,
} from "../services/favoritesService";
import styles from "./FavoriteButton.module.css";

function FavoriteButton({ movie, className = "", onToggle }) {
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const favoriteStatus = await checkIsFavorite(movie.id);
      setIsFavorite(favoriteStatus);
    } catch (err) {
      console.error("Failed to check favorite status:", err);
    }
  }, [movie]);

  // Перевіряємо статус улюбленого при завантаженні
  useEffect(() => {
    if (isAuthenticated && movie) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, movie, checkFavoriteStatus]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setError("Увійдіть в акаунт, щоб додавати фільми до улюблених");
      return;
    }

    if (!movie) {
      setError("Інформація про фільм недоступна");
      return;
    }

    console.log("Toggle favorite - start:", {
      movieId: movie.id,
      movieTitle: movie.title,
      currentIsFavorite: isFavorite,
      isAuthenticated,
      currentPage: window.location.pathname,
      userObject: user,
      sessionId: localStorage.getItem("tmdb_session_id"),
    });

    setIsLoading(true);
    setError(null);

    try {
      const result = await toggleMovieFavorite(movie, isFavorite);
      console.log("Toggle favorite - result:", result);

      if (result.success) {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);

        // Викликаємо callback якщо він переданий
        if (onToggle) {
          onToggle(newFavoriteState);
        }

        // Показуємо повідомлення про успіх
        if (!isFavorite) {
          console.log(`✅ Фільм "${movie.title}" додано до улюблених`);
        } else {
          console.log(`✅ Фільм "${movie.title}" видалено з улюблених`);
        }
      } else {
        console.error("Toggle favorite - failed:", result);
        throw new Error(
          result.statusMessage || "Не вдалося оновити статус улюбленого"
        );
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setError(err.message || "Не вдалося оновити список улюблених");
    } finally {
      setIsLoading(false);
    }
  };

  // Очищення помилки через кілька секунд
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!movie) {
    return null;
  }

  return (
    <div className={`${styles.favoriteButtonContainer} ${className}`}>
      <button
        className={`${styles.favoriteButton} ${
          isFavorite ? styles.active : ""
        } ${isLoading ? styles.loading : ""} ${
          className ? styles[className] || className : ""
        }`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        title={
          !isAuthenticated
            ? "Увійдіть в акаунт, щоб додавати до улюблених"
            : isFavorite
            ? "Видалити з улюблених"
            : "Додати до улюблених"
        }
        aria-label={
          isFavorite
            ? `Видалити "${movie.title}" з улюблених`
            : `Додати "${movie.title}" до улюблених`
        }
      >
        <span className={styles.icon}>
          {isLoading ? "🔄" : isFavorite ? "❤️" : "🤍"}
        </span>

        <span className={styles.text}>
          {isLoading
            ? "Завантаження..."
            : isFavorite
            ? "В улюблених"
            : "Додати до улюблених"}
        </span>
      </button>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

FavoriteButton.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
  onToggle: PropTypes.func,
};

export default FavoriteButton;
