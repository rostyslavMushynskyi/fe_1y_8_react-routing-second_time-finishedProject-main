import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Oval } from "react-loader-spinner";
import { useAuth } from "../contexts/AuthContext";
import { getFavorites } from "../services/favoritesService";
import { getPosterUrl, getYear, formatRating } from "../utils/movieHelpers";
import { sortMoviesOnClient } from "../utils/movieFilters";
import FavoriteButton from "../components/FavoriteButton";
import { motion } from "framer-motion";
import styles from "./FavoritesPage.module.css";

const SORT_OPTIONS = [
  { value: "date_added.desc", label: "Нещодавно додані" },
  { value: "date_added.asc", label: "Давно додані" },
  { value: "title.asc", label: "За назвою (А-Я)" },
  { value: "title.desc", label: "За назвою (Я-А)" },
  { value: "vote_average.desc", label: "Рейтинг (спадання)" },
  { value: "vote_average.asc", label: "Рейтинг (зростання)" },
  { value: "release_date.desc", label: "Рік випуску (нові)" },
  { value: "release_date.asc", label: "Рік випуску (старі)" },
];

function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_added.desc");

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const allFavorites = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const result = await getFavorites(currentPage);
        allFavorites.push(...result.results);
        totalPages = result.totalPages;
        currentPage++;
      } while (currentPage <= totalPages && totalPages > 1);

      setFavorites(allFavorites);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setError(
        err.response?.status === 401
          ? "Потрібна авторизація. Будь ласка, увійдіть в акаунт."
          : "Не вдалося завантажити улюблені фільми. Перевірте з'єднання з інтернетом."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const filteredAndSortedFavorites = useMemo(() => {
    let result = [...favorites];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (movie) =>
          movie.title?.toLowerCase().includes(query) ||
          movie.original_title?.toLowerCase().includes(query) ||
          movie.overview?.toLowerCase().includes(query)
      );
    }

    result = sortMoviesOnClient(result, sortBy);

    return result;
  }, [favorites, searchQuery, sortBy]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleFavoriteToggle = useCallback((movieId, isFavorite) => {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className={styles.favoritesPage}>
        <Helmet>
          <title>Улюблені фільми | MovieRate</title>
          <meta
            name="description"
            content="Переглядайте та керуйте своїми улюбленими фільмами"
          />
        </Helmet>

        <div className={styles.container}>
          <div className={styles.authPrompt}>
            <div className={styles.authIcon}>🔒</div>
            <h2 className={styles.authTitle}>Увійдіть в акаунт</h2>
            <p className={styles.authMessage}>
              Щоб переглядати та керувати улюбленими фільмами, потрібно увійти в
              акаунт.
            </p>
            <Link to="/login" className={styles.loginButton}>
              Увійти в акаунт
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <Helmet>
        <title>
          {favorites.length > 0
            ? `Мої улюблені фільми (${favorites.length}) | MovieRate`
            : "Мої улюблені фільми | MovieRate"}
        </title>
        <meta
          name="description"
          content={
            favorites.length > 0
              ? `Переглядайте та керуйте ${favorites.length} улюбленими фільмами на MovieRate`
              : "Переглядайте та керуйте своїми улюбленими фільмами на MovieRate"
          }
        />
      </Helmet>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Мої улюблені фільми</h1>
          <p className={styles.subtitle}>
            Ваша персональна колекція найкращих фільмів
          </p>
          {favorites.length > 0 && (
            <p className={styles.count}>
              Усього: <strong>{favorites.length}</strong> фільм(ів)
            </p>
          )}
        </header>

        {favorites.length > 0 && (
          <div className={styles.controlsSection}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Пошук в улюблених фільмах..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
                aria-label="Пошук фільмів"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={styles.clearButton}
                  aria-label="Очистити пошук"
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.sortContainer}>
              <label htmlFor="sort" className={styles.sortLabel}>
                Сортування:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className={styles.sortSelect}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {searchQuery && filteredAndSortedFavorites.length > 0 && (
          <p className={styles.searchResults}>
            Знайдено: <strong>{filteredAndSortedFavorites.length}</strong> з{" "}
            <strong>{favorites.length}</strong> фільм(ів)
          </p>
        )}

        {isLoading && (
          <div className={styles.loadingContainer}>
            <Oval
              color="#4ecdc4"
              secondaryColor="rgba(255, 255, 255, 0.3)"
              height={60}
              width={60}
            />
            <p className={styles.loadingText}>
              Завантаження улюблених фільмів...
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3 className={styles.errorTitle}>Упс! Щось пішло не так</h3>
            <p className={styles.errorMessage}>{error}</p>
            <button onClick={loadFavorites} className={styles.retryButton}>
              Спробувати знову
            </button>
          </div>
        )}

        {!isLoading && !error && favorites.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💙</div>
            <h3 className={styles.emptyTitle}>Улюблені фільми відсутні</h3>
            <p className={styles.emptyMessage}>
              Ви ще не додали жодного фільму до улюблених. Досліджуйте фільми та
              додавайте найкращі!
            </p>
            <Link to="/movies" className={styles.exploreButton}>
              Дослідити фільми
            </Link>
          </div>
        )}

        {!isLoading &&
          !error &&
          favorites.length > 0 &&
          filteredAndSortedFavorites.length === 0 &&
          searchQuery && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>Нічого не знайдено</h3>
              <p className={styles.emptyMessage}>
                За запитом <strong>&quot;{searchQuery}&quot;</strong> не
                знайдено жодного фільму в ваших улюблених.
              </p>
              <button onClick={clearSearch} className={styles.exploreButton}>
                Показати всі улюблені
              </button>
            </div>
          )}

        {!isLoading && !error && filteredAndSortedFavorites.length > 0 && (
          <section className={styles.moviesSection}>
            <motion.ul
              className={styles.moviesGrid}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06, delayChildren: 0.02 },
                },
              }}
            >
              {filteredAndSortedFavorites.map((movie) => (
                <motion.li
                  key={movie.id}
                  className={styles.movieCard}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: "easeOut" },
                    },
                  }}
                >
                  <Link
                    to={`/movie/${movie.id}`}
                    className={styles.movieLink}
                    aria-label={`Переглянути деталі фільму ${movie.title}`}
                  >
                    <div className={styles.posterContainer}>
                      {movie.poster_path ? (
                        <img
                          src={getPosterUrl(movie.poster_path)}
                          alt={`Постер фільму "${movie.title}"`}
                          className={styles.moviePoster}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.posterPlaceholder}>
                          <span className={styles.placeholderIcon}>🎬</span>
                          <span className={styles.placeholderText}>
                            Постер недоступний
                          </span>
                        </div>
                      )}
                    </div>

                    {movie.vote_average > 0 && (
                      <div className={styles.movieRatingBadge}>
                        {formatRating(movie.vote_average)}
                      </div>
                    )}

                    <div className={styles.movieInfo}>
                      <h3 className={styles.movieTitle}>{movie.title}</h3>

                      <div className={styles.movieMeta}>
                        <span className={styles.releaseYear}>
                          {getYear(movie.release_date)}
                        </span>
                      </div>

                      {movie.overview && (
                        <p className={styles.movieOverview}>{movie.overview}</p>
                      )}
                    </div>
                  </Link>

                  <div
                    className={styles.favoriteButtonContainer}
                    onClick={(e) => e.preventDefault()}
                  >
                    <FavoriteButton
                      movie={movie}
                      className="small"
                      onToggle={(isFavorite) =>
                        handleFavoriteToggle(movie.id, isFavorite)
                      }
                    />
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
