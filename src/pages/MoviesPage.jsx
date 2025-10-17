import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  searchMoviesService,
  discoverMoviesService,
} from "../services/moviesService";
import Searchbar from "../components/Searchbar";
import FilterSort from "../components/FilterSort";
import FavoriteButton from "../components/FavoriteButton";
import styles from "./MoviesPage.module.css";
import { Oval } from "react-loader-spinner";
import PageLoader from "../components/PageLoader";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import { motion } from "framer-motion";

// Client-side filtering for search results (optional for discover)
function filterMoviesOnClient(movies, filters) {
  return movies.filter((movie) => {
    // exclude adult content
    if (movie.adult === true) return false;

    // genres
    if (filters.genres && filters.genres.length > 0) {
      const ids = movie.genre_ids || [];
      const hasMatchingGenre = ids.some((id) => filters.genres.includes(id));
      if (!hasMatchingGenre) return false;
    }

    // year
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

    // rating
    if (filters.ratingMin && movie.vote_average < parseFloat(filters.ratingMin))
      return false;
    if (filters.ratingMax && movie.vote_average > parseFloat(filters.ratingMax))
      return false;

    return true;
  });
}

// Sorting helper
function sortMoviesOnClient(movies, sortBy) {
  const arr = [...movies];
  switch (sortBy) {
    case "popularity.desc":
      return arr.sort((a, b) => b.popularity - a.popularity);
    case "popularity.asc":
      return arr.sort((a, b) => a.popularity - b.popularity);
    case "vote_average.desc":
      return arr.sort((a, b) => b.vote_average - a.vote_average);
    case "vote_average.asc":
      return arr.sort((a, b) => a.vote_average - b.vote_average);
    case "release_date.desc":
      return arr.sort(
        (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)
      );
    case "release_date.asc":
      return arr.sort(
        (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0)
      );
    case "title.asc":
      return arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "title.desc":
      return arr.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    default:
      return arr;
  }
}

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const abortRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentQuery = searchParams.get("query") || "";

  // Filters from URL
  const currentFilters = useMemo(
    () => ({
      sortBy: searchParams.get("sortBy") || "popularity.desc",
      genres: searchParams.get("genres")
        ? searchParams.get("genres").split(",").map(Number)
        : [],
      yearFrom: searchParams.get("yearFrom") || "",
      yearTo: searchParams.get("yearTo") || "",
      ratingMin: searchParams.get("ratingMin") || "",
      ratingMax: searchParams.get("ratingMax") || "",
    }),
    [searchParams]
  );

  // Unified fetcher to support first load and "show more"
  const fetchPage = useCallback(
    async (pageToLoad, { append } = { append: false }) => {
      // Cancel previous request if any
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        let res;
        if (currentQuery) {
          res = await searchMoviesService(currentQuery, pageToLoad, {
            signal: controller.signal,
          });
        } else {
          res = await discoverMoviesService(currentFilters, pageToLoad, {
            signal: controller.signal,
          });
        }

        let data = res?.results || [];
        if (currentQuery) {
          // Only for search: optional client filters
          data = filterMoviesOnClient(data, currentFilters);
        }
        data = sortMoviesOnClient(data, currentFilters.sortBy);

        setTotalPages(res?.totalPages || 1);
        setTotalResults(
          typeof res?.totalCount === "number" ? res.totalCount : data.length
        );

        setMovies((prev) => (append ? [...prev, ...data] : data));
        setCurrentPage(pageToLoad);
      } catch (e) {
        if (e?.name === "CanceledError" || e?.name === "AbortError") return;
        console.error("Movies load error:", e);
        if (!append) {
          setMovies([]);
          setTotalPages(1);
          setTotalResults(0);
          setCurrentPage(1);
        }
      } finally {
        if (append) setIsLoadingMore(false);
        else setIsLoading(false);
      }
    },
    [currentQuery, currentFilters]
  );

  // Initial load and when query/filters change → reset and load page 1
  useEffect(() => {
    setMovies([]);
    setTotalPages(1);
    setTotalResults(0);
    setCurrentPage(1);
    fetchPage(1, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuery, currentFilters.sortBy, currentFilters.genres.join("-"), currentFilters.yearFrom, currentFilters.yearTo, currentFilters.ratingMin, currentFilters.ratingMax]);

  // Search handler: reset to page=1, keep current sort/filters unless you want to clear them
  const handleSearch = useCallback(
    (newQuery) => {
      setSearchParams((prev) => {
        const next = Object.fromEntries(prev.entries());
        if (newQuery) next.query = newQuery; else delete next.query;
        // do not manage page in URL anymore
        next.sortBy = currentFilters.sortBy;
        if (currentFilters.genres.length) next.genres = currentFilters.genres.join(","); else delete next.genres;
        if (currentFilters.yearFrom) next.yearFrom = currentFilters.yearFrom; else delete next.yearFrom;
        if (currentFilters.yearTo) next.yearTo = currentFilters.yearTo; else delete next.yearTo;
        if (currentFilters.ratingMin) next.ratingMin = currentFilters.ratingMin; else delete next.ratingMin;
        if (currentFilters.ratingMax) next.ratingMax = currentFilters.ratingMax; else delete next.ratingMax;
        return next;
      });
    },
    [currentFilters, setSearchParams]
  );

  // Filters change: reset to page 1
  const handleFiltersChange = useCallback(
    (newFilters) => {
      setSearchParams((prev) => {
        const next = Object.fromEntries(prev.entries());
        if (currentQuery) next.query = currentQuery; else delete next.query;
        // do not manage page in URL anymore
        next.sortBy = newFilters.sortBy || "popularity.desc";
        if (newFilters.genres?.length) next.genres = newFilters.genres.join(","); else delete next.genres;
        if (newFilters.yearFrom) next.yearFrom = newFilters.yearFrom; else delete next.yearFrom;
        if (newFilters.yearTo) next.yearTo = newFilters.yearTo; else delete next.yearTo;
        if (newFilters.ratingMin) next.ratingMin = newFilters.ratingMin; else delete next.ratingMin;
        if (newFilters.ratingMax) next.ratingMax = newFilters.ratingMax; else delete next.ratingMax;
        return next;
      });
    },
    [currentQuery, setSearchParams]
  );

  const handleShowMore = useCallback(() => {
    if (isLoading || isLoadingMore) return;
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      fetchPage(nextPage, { append: true });
    }
  }, [currentPage, totalPages, isLoading, isLoadingMore, fetchPage]);

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={styles.moviesPage}>
      <PageLoader show={isLoading && movies.length === 0} />
      <Helmet>
        <title>
          {currentQuery
            ? `Пошук: ${currentQuery} | MovieRate`
            : "Пошук фільмів | MovieRate"}
        </title>
      </Helmet>

      <div className={styles.container}>
        {isLoading && movies.length > 0 && (
          <div className={styles.loaderContainer}>
            <Oval color="#fff" secondaryColor="rgba(255, 255, 255, 0.3)" />
          </div>
        )}

        <div className={styles.searchSection}>
          <h1 className={styles.searchTitle}>🎬 Пошук Фільмів</h1>
          <p className={styles.searchSubtitle}>
            Знайдіть улюблені фільми серед мільйонів назв
          </p>
          <Searchbar onSearch={handleSearch} defaultValue={currentQuery} />
        </div>

        <FilterSort
          onFiltersChange={handleFiltersChange}
          initialFilters={currentFilters}
          showFilters={true}
          showSort={true}
        />

        {movies.length > 0 ? (
          <div className={styles.resultsSection}>
            {currentQuery ? (
              <p className={styles.searchInfo}>
                Результати пошуку:{" "}
                <span className={styles.query}>&quot;{currentQuery}&quot;</span>
                {totalResults > 0 && (
                  <span className={styles.resultsCount}>
                    {" "}
                    — знайдено {totalResults.toLocaleString()} (сторінка{" "}
                    {currentPage} з {totalPages})
                  </span>
                )}
              </p>
            ) : (
              <p className={styles.searchInfo}>
                Каталог фільмів
                {totalResults > 0 && (
                  <span className={styles.resultsCount}>
                    {" "}
                    — всього {totalResults.toLocaleString()} (сторінка{" "}
                    {currentPage} з {totalPages})
                  </span>
                )}
              </p>
            )}

            <motion.div
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
              {movies.map((movie) => (
                <motion.div key={movie.id} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } }}>
                  <Link
                    to={`/movie/${movie.id}`}
                    className={styles.movieCard}
                  >
                  <div className={styles.posterContainer}>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className={styles.poster}
                      />
                    ) : (
                      <div className={styles.noPoster}>
                        <span>No Image</span>
                      </div>
                    )}

                    {/* Prevent navigation when toggling favorite */}
                    <div
                      className={styles.favoriteOverlay}
                      onClick={(e) => e.preventDefault()}
                    >
                      <FavoriteButton movie={movie} className="small" />
                    </div>
                  </div>

                  {movie.vote_average > 0 && (
                    <div className={styles.movieRatingBadge}>
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}

                  <div className={styles.movieInfo}>
                    <h3 className={styles.movieTitle}>{movie.title}</h3>
                    {movie.release_date && (
                      <p className={styles.releaseDate}>
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                  </Link>
                </motion.div>
              ))}

              {/* Skeletons */}
              {(isLoading && movies.length === 0) || isLoadingMore ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={`sk-${idx}`}>
                    <MovieCardSkeleton />
                  </div>
                ))
              ) : null}
            </motion.div>

            {(currentPage < totalPages || movies.length > 0) && (
              <div className={styles.loadMoreWrapper}>
                {currentPage < totalPages && (
                  <button
                    type="button"
                    className={styles.loadMoreButton}
                    onClick={handleShowMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Завантаження..." : "Показати ще"}
                  </button>
                )}
                <button
                  type="button"
                  className={styles.scrollTopButton}
                  onClick={handleScrollTop}
                >
                  ↑ До гори
                </button>
              </div>
            )}
          </div>
        ) : !isLoading ? (
          <div className={styles.noResults}>
            {currentQuery ? (
              <div className={styles.noResultsContent}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3 className={styles.noResultsTitle}>Нічого не знайдено</h3>
                <p className={styles.noResultsText}>
                  За запитом{" "}
                  <span className={styles.query}>&quot;{currentQuery}&quot;</span>{" "}
                  результатів не знайдено
                </p>
                <p className={styles.noResultsHint}>
                  Спробуйте змінити пошуковий запит або перевірте правопис
                </p>
              </div>
            ) : (
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeIcon}>🎭</div>
                <h3 className={styles.welcomeTitle}>Почніть пошук фільмів</h3>
                <p className={styles.welcomeText}>
                  Введіть назву фільму у поле пошуку вище, щоб знайти цікаві
                  кінострічки
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}