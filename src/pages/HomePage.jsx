import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getTrendingService } from "../services/trendingService";
import { Oval } from "react-loader-spinner";
import FavoriteButton from "../components/FavoriteButton";
import HeroVideo from "../components/HeroVideo";
import { motion } from "framer-motion";
import styles from "./HomePage.module.css";

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getTrendingService()
      .then((res) => {
        setMovies(res.results);
      })
      .catch((err) => {
        console.error("Failed to fetch trending movies:", err);
        setError("Не вдалося завантажити трендові фільми. Спробуйте пізніше.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const getYear = (dateString) => {
    if (!dateString) return "Невідомо";
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return Math.round(rating * 10) / 10;
  };

  // Variants для анімацій при появі в viewport
  const fadeBlurUp = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className={styles.homePage}>
      <Helmet>
        <title>MovieRate | Головна</title>
        <meta
          name="description"
          content="Відкрийте для себе найпопулярніші фільми. Трендові новинки кіно, рейтинги та детальна інформація."
        />
      </Helmet>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>MovieRate</h1>
            <p className={styles.subtitle}>
              Відкрийте для себе найкращі фільми світу. Дізнавайтеся про
              трендові новинки, читайте відгуки та створюйте власну колекцію
              улюблених фільмів.
            </p>
            <Link to="/movies" className={styles.ctaButton}>
              Почати пошук фільмів
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎬</div>
            <h3 className={styles.featureTitle}>Величезна колекція</h3>
            <p className={styles.featureDescription}>
              Доступ до тисяч фільмів з детальною інформацією, трейлерами та
              рейтингами
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⭐</div>
            <h3 className={styles.featureTitle}>Персональні оцінки</h3>
            <p className={styles.featureDescription}>
              Оцінюйте фільми та діліться своїми враженнями з іншими
              користувачами
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>❤️</div>
            <h3 className={styles.featureTitle}>Список улюблених</h3>
            <p className={styles.featureDescription}>
              Зберігайте улюблені фільми у персональній колекції для швидкого
              доступу
            </p>
          </div>
        </section>

        {/* Відео-трейлер (анімація при скролі) */}
        <motion.section
          variants={fadeBlurUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <HeroVideo
            videoId="U2Qp5pL3ovA"
            title="Дюна: Частина друга — офіційний трейлер"
          />
        </motion.section>

        {/* Trending Movies Section (анімація при скролі) */}
        <section>
          <motion.h2
            className={styles.sectionTitle}
            variants={fadeBlurUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            🔥 Трендові фільми
          </motion.h2>

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

          {error && (
            <div className={styles.errorContainer}>
              <h3 className={styles.errorTitle}>Упс! Щось пішло не так</h3>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          )}

          {!isLoading && !error && movies.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎬</div>
              <h3 className={styles.emptyTitle}>Фільми не знайдено</h3>
              <p className={styles.emptyMessage}>
                На жаль, зараз немає доступних трендових фільмів.
              </p>
            </div>
          )}

          {!isLoading && !error && movies.length > 0 && (
            <motion.ul
              className={styles.moviesGrid}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {movies.map((movie) => (
                <motion.li
                  key={movie.id}
                  className={styles.movieCard}
                  variants={cardVariant}
                >
                  {/* збереження state з поточною локацією */}
                  <Link
                    to={`/movie/${movie.id}`}
                    className={styles.movieLink}
                    state={{ from: location.pathname }}
                  >
                    <div className={styles.posterContainer}>
                      {getPosterUrl(movie.poster_path) ? (
                        <img
                          src={getPosterUrl(movie.poster_path)}
                          alt={`Постер фільму "${movie.title}"`}
                          className={styles.moviePoster}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.posterPlaceholder}>
                          <span>Постер недоступний</span>
                        </div>
                      )}

                      {/* Favorite Button Overlay */}
                      <div
                        className={styles.favoriteOverlay}
                        onClick={(e) => e.preventDefault()}
                      >
                        <FavoriteButton movie={movie} className="small" />
                      </div>
                    </div>

                    {/* Rating Badge */}
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
                </motion.li>
              ))}
            </motion.ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
