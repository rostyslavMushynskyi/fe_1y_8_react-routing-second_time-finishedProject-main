import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./FilterSort.module.css";

const GENRES = [
  { id: 28, name: "Бойовик" },
  { id: 12, name: "Пригоди" },
  { id: 16, name: "Анімація" },
  { id: 35, name: "Комедія" },
  { id: 80, name: "Кримінал" },
  { id: 99, name: "Документальний" },
  { id: 18, name: "Драма" },
  { id: 10751, name: "Сімейний" },
  { id: 14, name: "Фентезі" },
  { id: 36, name: "Історичний" },
  { id: 27, name: "Жахи" },
  { id: 10402, name: "Музика" },
  { id: 9648, name: "Детектив" },
  { id: 10749, name: "Мелодрама" },
  { id: 878, name: "Наукова фантастика" },
  { id: 10770, name: "ТВ фільм" },
  { id: 53, name: "Трилер" },
  { id: 10752, name: "Воєнний" },
  { id: 37, name: "Вестерн" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Популярність (спадання)" },
  { value: "popularity.asc", label: "Популярність (зростання)" },
  { value: "vote_average.desc", label: "Рейтинг (спадання)" },
  { value: "vote_average.asc", label: "Рейтинг (зростання)" },
  { value: "release_date.desc", label: "Дата виходу (нові спочатку)" },
  { value: "release_date.asc", label: "Дата виходу (старі спочатку)" },
  { value: "title.asc", label: "За назвою (А-Я)" },
  { value: "title.desc", label: "За назвою (Я-А)" },
];

// Допоміжні утиліти для порівняння фільтрів (поза компонентом, щоб уникнути зайвих залежностей)
const arraysEqualShallow = (a = [], b = []) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const areFiltersEqual = (a, b) => {
  return (
    a.sortBy === b.sortBy &&
    a.yearFrom === b.yearFrom &&
    a.yearTo === b.yearTo &&
    a.ratingMin === b.ratingMin &&
    a.ratingMax === b.ratingMax &&
    arraysEqualShallow(a.genres, b.genres)
  );
};

function FilterSort({
  onFiltersChange,
  initialFilters = {},
  showFilters = true,
  showSort = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "popularity.desc",
    genres: [],
    yearFrom: "",
    yearTo: "",
    ratingMin: "",
    ratingMax: "",
    ...initialFilters,
  });

  const timeoutRef = useRef();
  const isInitialMount = useRef(true);
  const currentYear = new Date().getFullYear();

  // Синхронізуємо локальний стан з пропсами при зміні initialFilters, але лише якщо значення справді змінились
  useEffect(() => {
    setFilters((prev) => {
      const next = {
        sortBy: initialFilters.sortBy ?? prev.sortBy ?? "popularity.desc",
        genres: Array.isArray(initialFilters.genres)
          ? initialFilters.genres
          : prev.genres ?? [],
        yearFrom: initialFilters.yearFrom ?? prev.yearFrom ?? "",
        yearTo: initialFilters.yearTo ?? prev.yearTo ?? "",
        ratingMin: initialFilters.ratingMin ?? prev.ratingMin ?? "",
        ratingMax: initialFilters.ratingMax ?? prev.ratingMax ?? "",
      };
      // Якщо нічого не змінилося — не оновлюємо стан, щоб не запускати onFiltersChange і не скидати сторінку
      if (areFiltersEqual(prev, next)) return prev;
      return next;
    });
  }, [initialFilters]);

  // Debounced callback для уникнення зайвих викликів
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Очищуємо попередній timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Встановлюємо новий timeout для debouncing
    timeoutRef.current = setTimeout(() => {
      onFiltersChange(filters);
    }, 150); // 150мс затримка

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters, onFiltersChange]);

  const handleSortChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: event.target.value,
    }));
  };

  const handleGenreChange = (genreId) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((id) => id !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "popularity.desc",
      genres: [],
      yearFrom: "",
      yearTo: "",
      ratingMin: "",
      ratingMax: "",
    });
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.ratingMin ||
    filters.ratingMax;

  return (
    <div className={styles.filterSort}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {showSort && (
            <div className={styles.sortSelect}>
              <label htmlFor="sort" className={styles.label}>
                Сортування:
              </label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={handleSortChange}
                className={styles.select}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {showFilters && (
          <div className={styles.headerRight}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`${styles.filterToggle} ${
                isExpanded ? styles.active : ""
              }`}
            >
              <span className={styles.filterIcon}>🔍</span>
              Фільтри
              {hasActiveFilters && (
                <span className={styles.filterBadge}>
                  {filters.genres.length +
                    (filters.yearFrom ? 1 : 0) +
                    (filters.yearTo ? 1 : 0) +
                    (filters.ratingMin ? 1 : 0) +
                    (filters.ratingMax ? 1 : 0)}
                </span>
              )}
              <span
                className={`${styles.arrow} ${isExpanded ? styles.up : ""}`}
              >
                ▼
              </span>
            </button>
          </div>
        )}
      </div>

      {showFilters && isExpanded && (
        <div className={styles.filtersPanel}>
          {/* Жанри */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Жанри</h4>
            <div className={styles.genresGrid}>
              {GENRES.map((genre) => (
                <label
                  key={genre.id}
                  className={`${styles.genreItem} ${
                    filters.genres.includes(genre.id) ? styles.selected : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre.id)}
                    onChange={() => handleGenreChange(genre.id)}
                    className={styles.genreCheckbox}
                  />
                  <span className={styles.genreLabel}>{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Рік випуску */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Рік випуску</h4>
            <div className={styles.yearRange}>
              <div className={styles.inputGroup}>
                <label htmlFor="yearFrom" className={styles.label}>
                  Від:
                </label>
                <input
                  id="yearFrom"
                  type="number"
                  min="1900"
                  max={currentYear}
                  value={filters.yearFrom}
                  onChange={handleInputChange("yearFrom")}
                  placeholder="1990"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="yearTo" className={styles.label}>
                  До:
                </label>
                <input
                  id="yearTo"
                  type="number"
                  min="1900"
                  max={currentYear}
                  value={filters.yearTo}
                  onChange={handleInputChange("yearTo")}
                  placeholder={currentYear.toString()}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Рейтинг */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Рейтинг TMDB</h4>
            <div className={styles.ratingRange}>
              <div className={styles.inputGroup}>
                <label htmlFor="ratingMin" className={styles.label}>
                  Мін:
                </label>
                <input
                  id="ratingMin"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.ratingMin}
                  onChange={handleInputChange("ratingMin")}
                  placeholder="0.0"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="ratingMax" className={styles.label}>
                  Макс:
                </label>
                <input
                  id="ratingMax"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.ratingMax}
                  onChange={handleInputChange("ratingMax")}
                  placeholder="10.0"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Кнопки дій */}
          <div className={styles.filterActions}>
            <button
              type="button"
              onClick={clearFilters}
              className={styles.clearButton}
              disabled={!hasActiveFilters}
            >
              Очистити всі фільтри
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

FilterSort.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
  showFilters: PropTypes.bool,
  showSort: PropTypes.bool,
};

export default FilterSort;
