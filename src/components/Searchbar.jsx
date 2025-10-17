import { useEffect, useState } from "react";
import styles from "./Searchbar.module.css";

// eslint-disable-next-line react/prop-types
function Searchbar({ onSearch, defaultValue = "" }) {
  const [query, setQuery] = useState(defaultValue);

  // Keep input in sync with URL/query param changes
  useEffect(() => {
    setQuery(defaultValue || "");
  }, [defaultValue]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <input
          type="search"
          name="query"
          placeholder="Пошук фільмів..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className={styles.searchInput}
        />
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <button type="submit" className={styles.searchButton}>
        <span className={styles.buttonText}>Пошук</span>
        <svg
          className={styles.buttonIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 7L18 12L13 17M6 12H18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

export default Searchbar;
