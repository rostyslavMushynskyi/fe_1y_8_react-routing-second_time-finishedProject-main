import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Oval } from "react-loader-spinner";
import { useAuth } from "../contexts/AuthContext";
import {
  getRatedMovies,
  removeMovieRating,
  getRatingsStats,
} from "../services/ratingService";
import { getMoviesDetails } from "../services/moviesService";
import { getPosterUrl, formatRating } from "../utils/movieHelpers";
import { motion } from "framer-motion";
import styles from "./MyRatingsPage.module.css";

const SORT_OPTIONS = [
  { value: "ratedAt", label: "Даті оцінки" },
  { value: "rating", label: "Оцінці" },
  { value: "title", label: "Назві" },
  { value: "releaseDate", label: "Року випуску" },
];

function MyRatingsPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [ratedMovies, setRatedMovies] = useState([]);
  const [moviesDetails, setMoviesDetails] = useState({});
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [sortBy, setSortBy] = useState("ratedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Невідомо";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const ratings = getRatedMovies();
      setRatedMovies(ratings);
      setStats(getRatingsStats());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMoviesDetails = async () => {
      if (ratedMovies.length === 0) return;

      setIsLoadingMovies(true);
      setError(null);

      try {
        const movieIds = ratedMovies
          .map((m) => m.movieId)
          .filter((id) => !moviesDetails[id]);

        if (movieIds.length === 0) {
          setIsLoadingMovies(false);
          return;
        }

        const detailsPromises = movieIds.map(async (movieId) => {
          try {
            const movieData = await getMoviesDetails(movieId);
            return { [movieId]: movieData };
          } catch (error) {
            console.error(`Failed to load movie ${movieId}:`, error);
            return {
              [movieId]: {
                id: movieId,
                title: `Фільм ID: ${movieId}`,
                poster_path: null,
                release_date: null,
              },
            };
          }
        });

        const results = await Promise.all(detailsPromises);
        const newDetails = results.reduce(
          (acc, detail) => ({ ...acc, ...detail }),
          {}
        );

        setMoviesDetails((prev) => ({ ...prev, ...newDetails }));
      } catch (error) {
        console.error("Error fetching movies details:", error);
        setError("Не вдалося завантажити деталі фільмів");
      } finally {
        setIsLoadingMovies(false);
      }
    };

    fetchMoviesDetails();
  }, [ratedMovies, moviesDetails]);

  const handleRemoveRating = useCallback(async (movieId) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю оцінку?")) {
      return;
    }

    try {
      await removeMovieRating(movieId);
      setRatedMovies((prev) =>
        prev.filter((movie) => movie.movieId !== movieId)
      );
      setStats(getRatingsStats());
    } catch (error) {
      console.error("Failed to remove rating:", error);
      alert("Не вдалося видалити оцінку. Спробуйте пізніше.");
    }
  }, []);

  const sortedMovies = useMemo(() => {
    return [...ratedMovies].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "title":
          aValue = moviesDetails[a.movieId]?.title || a.title || "";
          bValue = moviesDetails[b.movieId]?.title || b.title || "";
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        case "releaseDate":
          aValue = moviesDetails[a.movieId]?.release_date
            ? new Date(moviesDetails[a.movieId].release_date)
            : new Date(0);
          bValue = moviesDetails[b.movieId]?.release_date
            ? new Date(moviesDetails[b.movieId].release_date)
            : new Date(0);
          break;
        case "ratedAt":
        default:
          aValue = new Date(a.ratedAt);
          bValue = new Date(b.ratedAt);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [ratedMovies, sortBy, sortOrder, moviesDetails]);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Oval color="#4ecdc4" height={60} width={60} />
        <p className={styles.loadingText}>Завантаження...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.myRatingsPage}>
      <Helmet>
        <title>
          {ratedMovies.length > 0
            ? `Мої оцінки (${ratedMovies.length}) | MovieRate`
            : "Мої оцінки | MovieRate"}
        </title>
        <meta
          name="description"
          content="Перегляд всіх фільмів, які ви оцінили на MovieRate"
        />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мої оцінки фільмів</h1>

          {stats && ratedMovies.length > 0 && (
            <div className={styles.statsBar}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalRated}</span>
                <span className={styles.statLabel}>фільмів оцінено</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.averageRating}</span>
                <span className={styles.statLabel}>середня оцінка</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.highestRating}</span>
                <span className={styles.statLabel}>найвища оцінка</span>
              </div>
            </div>
          )}
        </div>

        {ratedMovies.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⭐</div>
            <h2 className={styles.emptyTitle}>
              Ви ще не оцінили жодного фільму
            </h2>
            <p className={styles.emptyMessage}>
              Почніть оцінювати фільми, щоб побачити їх тут! Ваші оцінки
              допоможуть вам відстежувати переглянуті фільми.
            </p>
            <Link to="/movies" className={styles.exploreButton}>
              Знайти фільми
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.controls}>
              <div className={styles.sortControls}>
                <label htmlFor="sortBy" className={styles.sortLabel}>
                  Сортувати по:
                </label>
                <select
                  id="sortBy"
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

                <button
                  className={styles.sortOrderButton}
                  onClick={toggleSortOrder}
                  title={`Сортування ${
                    sortOrder === "asc" ? "за зростанням" : "за спаданням"
                  }`}
                  aria-label={`Змінити порядок сортування на ${
                    sortOrder === "asc" ? "спадання" : "зростання"
                  }`}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>

              <div className={styles.totalCount}>
                Усього: <strong>{ratedMovies.length}</strong> фільм(ів)
              </div>
            </div>

            {isLoadingMovies && (
              <div className={styles.loadingMovies}>
                <Oval color="#4ecdc4" height={30} width={30} />
                <span>Завантаження деталей фільмів...</span>
              </div>
            )}

            {error && (
              <div className={styles.errorBanner}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <motion.div
              className={styles.moviesList}
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
              {sortedMovies.map((movie) => {
                const movieDetails = moviesDetails[movie.movieId];

                return (
                  <motion.div
                    key={movie.movieId}
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
                      to={`/movie/${movie.movieId}`}
                      className={styles.movieLink}
                      aria-label={`Переглянути деталі фільму ${
                        movieDetails?.title || movie.title
                      }`}
                    >
                      <div className={styles.posterContainer}>
                        {movieDetails?.poster_path ? (
                          <img
                            src={getPosterUrl(movieDetails.poster_path, "w300")}
                            alt={`Постер фільму "${movieDetails.title}"`}
                            className={styles.poster}
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
                    </Link>

                    <div className={styles.movieInfo}>
                      <Link
                        to={`/movie/${movie.movieId}`}
                        className={styles.titleLink}
                      >
                        <h3 className={styles.movieTitle}>
                          {movieDetails?.title ||
                            movie.title ||
                            `Фільм ID: ${movie.movieId}`}
                        </h3>
                      </Link>

                      {movieDetails?.release_date && (
                        <p className={styles.releaseDate}>
                          {new Date(movieDetails.release_date).getFullYear()}
                        </p>
                      )}

                      <div className={styles.ratingInfo}>
                        <div className={styles.userRating}>
                          <span className={styles.ratingStars}>⭐</span>
                          <span className={styles.ratingValue}>
                            {formatRating(movie.rating)}/10
                          </span>
                        </div>

                        <div className={styles.ratingDate}>
                          Оцінено {formatDate(movie.ratedAt)}
                        </div>
                      </div>

                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveRating(movie.movieId)}
                        title="Видалити оцінку"
                        aria-label={`Видалити оцінку фільму ${
                          movieDetails?.title || movie.title
                        }`}
                      >
                        <span className={styles.removeIcon}>🗑️</span>
                        Видалити оцінку
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyRatingsPage;
