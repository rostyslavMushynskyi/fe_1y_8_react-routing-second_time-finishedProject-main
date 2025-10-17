import {
  useParams,
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { getMoviesDetails } from "../services/moviesService";
import { Oval } from "react-loader-spinner";
import FavoriteButton from "../components/FavoriteButton";
import UserRating from "../components/UserRating";
import styles from "./MovieDetailsPage.module.css";
import TrailerPlayer from "../components/TrailerPlayer";

function MovieDetailsPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getMoviesDetails(movieId)
      .then((res) => setMovie(res))
      .catch((err) => {
        console.error("Failed to fetch movie details:", err);
        setError(
          "Не вдалося завантажити інформацію про фільм. Спробуйте пізніше."
        );
      })
      .finally(() => setIsLoading(false));
  }, [movieId]);

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "Невідомо";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}г ${mins}хв` : `${mins}хв`;
  };

  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return Math.round(rating * 10) / 10;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Невідомо";
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isTabActive = (tabPath) => {
    return location.pathname.includes(tabPath);
  };

  // ✅ ВИПРАВЛЕНА ФУНКЦІЯ: повертає на сторінку, звідки прийшов користувач
  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/movies");
    }
  };

  return (
    <div className={styles.movieDetailsPage}>
      <Helmet>
        <title>
          {movie ? `${movie.title} | MovieRate` : "Завантаження... | MovieRate"}
        </title>
        {movie && (
          <meta
            name="description"
            content={
              movie.overview || `Детальна інформація про фільм "${movie.title}"`
            }
          />
        )}
      </Helmet>

      <div className={styles.container}>
        {/* ✅ ВИПРАВЛЕНА КНОПКА: використовує handleGoBack */}
        <button className={styles.backButton} onClick={handleGoBack}>
          <span className={styles.backIcon}>←</span>
          Назад
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <Oval
              color="#4ecdc4"
              secondaryColor="rgba(255, 255, 255, 0.3)"
              height={60}
              width={60}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorContainer}>
            <h2 className={styles.errorTitle}>Упс! Щось пішло не так</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.backButton} onClick={handleGoBack}>
              <span className={styles.backIcon}>←</span>
              Повернутися назад
            </button>
          </div>
        )}

        {/* Movie Content */}
        {movie && !isLoading && !error && (
          <>
            <div className={styles.movieContent}>
              <div className={styles.movieHeader}>
                {/* Poster */}
                <div className={styles.posterContainer}>
                  {getPosterUrl(movie.poster_path) ? (
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={`Постер фільму "${movie.title}"`}
                      className={styles.moviePoster}
                    />
                  ) : (
                    <div className={styles.posterPlaceholder}>
                      🎬
                      <br />
                      Постер
                      <br />
                      недоступний
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className={styles.movieInfo}>
                  <h1 className={styles.movieTitle}>{movie.title}</h1>

                  {/* Meta Information */}
                  <div className={styles.movieMeta}>
                    <div className={styles.metaItem}>
                      <span>⭐</span>
                      <span className={styles.rating}>
                        {formatRating(movie.vote_average)}
                      </span>
                    </div>

                    {movie.runtime && (
                      <div className={styles.metaItem}>
                        <span>⏱️</span>
                        <span className={styles.runtime}>
                          {formatRuntime(movie.runtime)}
                        </span>
                      </div>
                    )}

                    {movie.release_date && (
                      <div className={styles.metaItem}>
                        <span>📅</span>
                        <span className={styles.releaseDate}>
                          {formatDate(movie.release_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overview */}
                  {movie.overview && (
                    <div className={styles.overviewSection}>
                      <h2 className={styles.sectionTitle}>Опис</h2>
                      <p className={styles.overview}>{movie.overview}</p>
                    </div>
                  )}

                  <TrailerPlayer movieId={movieId} movieTitle={movie.title} />

                  {/* User Rating */}
                  <UserRating movieId={movieId} movieTitle={movie.title} />

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className={styles.genresSection}>
                      <h3 className={styles.sectionTitle}>Жанри</h3>
                      <ul className={styles.genresList}>
                        {movie.genres.map((genre) => (
                          <li key={genre.id} className={styles.genreTag}>
                            {genre.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Additional Info Cards */}
                  <div className={styles.infoCards}>
                    {typeof movie.budget === "number" && movie.budget > 0 && (
                      <div className={styles.infoCard}>
                        <h4>Бюджет</h4>
                        <p>${movie.budget.toLocaleString()}</p>
                      </div>
                    )}

                    {typeof movie.revenue === "number" && movie.revenue > 0 && (
                      <div className={styles.infoCard}>
                        <h4>Касові збори</h4>
                        <p>${movie.revenue.toLocaleString()}</p>
                      </div>
                    )}

                    {movie.vote_count > 0 && (
                      <div className={styles.infoCard}>
                        <h4>Кількість голосів</h4>
                        <p>{movie.vote_count.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Button */}
            <div className={styles.actionSection}>
              <FavoriteButton
                movie={movie}
                className={styles.favoriteButtonWrapper}
              />
            </div>

            {/* ✅ ВИПРАВЛЕНІ ПОСИЛАННЯ: додано replace для запобігання додавання в history */}
            <nav className={styles.navigationTabs}>
              <Link
                to="cast"
                replace
                className={`${styles.tabLink} ${
                  isTabActive("cast") ? styles.active : ""
                }`}
              >
                <span className={styles.tabIcon}>👥</span>
                Акторський склад
              </Link>

              <Link
                to="reviews"
                replace
                className={`${styles.tabLink} ${
                  isTabActive("reviews") ? styles.active : ""
                }`}
              >
                <span className={styles.tabIcon}>💬</span>
                Відгуки
              </Link>
            </nav>

            {/* Nested Routes Content */}
            <Outlet />
          </>
        )}
      </div>
    </div>
  );
}

export default MovieDetailsPage;