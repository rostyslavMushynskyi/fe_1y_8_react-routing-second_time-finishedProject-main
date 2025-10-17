// Сервіс для роботи з користувацькими рейтингами фільмів

const RATINGS_STORAGE_KEY = "movierate-user-ratings";

// Отримання всіх рейтингів з localStorage
export function getUserRatings() {
  try {
    const ratings = localStorage.getItem(RATINGS_STORAGE_KEY);
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error("Помилка при завантаженні рейтингів:", error);
    return {};
  }
}

// Отримання рейтингу конкретного фільму
export function getMovieRating(movieId) {
  const ratings = getUserRatings();
  return ratings[movieId] || null;
}

// Встановлення рейтингу для фільму
export function setMovieRating(movieId, rating, movieTitle = "") {
  try {
    const ratings = getUserRatings();
    const ratingData = {
      rating: rating,
      title: movieTitle,
      ratedAt: new Date().toISOString(),
    };

    ratings[movieId] = ratingData;
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));

    console.log(`Збережено рейтинг ${rating}/10 для фільму "${movieTitle}"`);
    return ratingData;
  } catch (error) {
    console.error("Помилка при збереженні рейтингу:", error);
    throw new Error("Не вдалося зберегти рейтинг");
  }
}

// Видалення рейтингу фільму
export function removeMovieRating(movieId) {
  try {
    const ratings = getUserRatings();
    if (ratings[movieId]) {
      delete ratings[movieId];
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
      console.log(`Видалено рейтинг для фільму ID: ${movieId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Помилка при видаленні рейтингу:", error);
    throw new Error("Не вдалося видалити рейтинг");
  }
}

// Отримання статистики рейтингів
export function getRatingsStats() {
  const ratings = getUserRatings();
  const ratingValues = Object.values(ratings).map((r) => r.rating);

  if (ratingValues.length === 0) {
    return {
      totalRated: 0,
      averageRating: 0,
      highestRating: 0,
      lowestRating: 0,
    };
  }

  const sum = ratingValues.reduce((acc, rating) => acc + rating, 0);
  const average = sum / ratingValues.length;

  return {
    totalRated: ratingValues.length,
    averageRating: Math.round(average * 10) / 10, // Округлюємо до 1 знака
    highestRating: Math.max(...ratingValues),
    lowestRating: Math.min(...ratingValues),
  };
}

// Отримання всіх оцінених фільмів (для можливої сторінки "Мої рейтинги")
export function getRatedMovies() {
  const ratings = getUserRatings();
  return Object.entries(ratings).map(([movieId, data]) => ({
    movieId: parseInt(movieId),
    ...data,
  }));
}

// Очищення всіх рейтингів (для налаштувань)
export function clearAllRatings() {
  try {
    localStorage.removeItem(RATINGS_STORAGE_KEY);
    console.log("Всі рейтинги очищено");
    return true;
  } catch (error) {
    console.error("Помилка при очищенні рейтингів:", error);
    return false;
  }
}
