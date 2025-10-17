import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getMovieRating,
  setMovieRating,
  removeMovieRating,
} from "../services/ratingService";
import styles from "./UserRating.module.css";

function UserRating({ movieId, movieTitle }) {
  const [userRating, setUserRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Завантажуємо збережений рейтинг при завантаженні компонента
  useEffect(() => {
    const savedRating = getMovieRating(movieId);
    if (savedRating) {
      setUserRating(savedRating.rating);
    }
  }, [movieId]);

  // Обробка кліку по зірці
  const handleRatingClick = async (rating) => {
    setIsLoading(true);
    try {
      await setMovieRating(movieId, rating, movieTitle);
      setUserRating(rating);
    } catch (error) {
      console.error("Помилка при збереженні рейтингу:", error);
      // TODO: Показати повідомлення про помилку
    } finally {
      setIsLoading(false);
    }
  };

  // Видалення рейтингу
  const handleRemoveRating = async () => {
    setIsLoading(true);
    try {
      await removeMovieRating(movieId);
      setUserRating(null);
    } catch (error) {
      console.error("Помилка при видаленні рейтингу:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Створюємо масив зірок (1-10)
  const stars = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <div className={styles.userRating}>
      <h4 className={styles.title}>Ваша оцінка:</h4>

      <div className={styles.ratingContainer}>
        <div className={styles.starsContainer}>
          {stars.map((star) => (
            <button
              key={star}
              className={`${styles.star} ${
                (hoveredRating || userRating) >= star ? styles.active : ""
              }`}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleRatingClick(star)}
              disabled={isLoading}
              aria-label={`Оцінити ${star} з 10`}
            >
              ⭐
            </button>
          ))}
        </div>

        <div className={styles.ratingInfo}>
          {userRating ? (
            <div className={styles.currentRating}>
              <span className={styles.ratingValue}>{userRating}/10</span>
              <button
                className={styles.removeButton}
                onClick={handleRemoveRating}
                disabled={isLoading}
                title="Видалити оцінку"
              >
                ❌
              </button>
            </div>
          ) : (
            <span className={styles.noRating}>
              {hoveredRating ? `${hoveredRating}/10` : "Оцініть фільм"}
            </span>
          )}
        </div>
      </div>

      {isLoading && <div className={styles.loading}>Збереження...</div>}
    </div>
  );
}

UserRating.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  movieTitle: PropTypes.string.isRequired,
};

export default UserRating;
