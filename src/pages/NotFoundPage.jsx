import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const suggestions = [
    { to: "/", label: "🏠 Головна сторінка", description: "Повернутися до початку" },
    { to: "/movies", label: "🎬 Пошук фільмів", description: "Знайти цікаві фільми" },
    { to: "/author", label: "👨‍💻 Про автора", description: "Дізнатися про проект" }
  ];

  return (
    <div className={styles.container}>
      <Helmet>
        <title>404 | Сторінку не знайдено — MovieRate</title>
        <meta
          name="description"
          content="Сторінка не знайдена. Перейдіть на головну, щоб продовжити перегляд фільмів."
        />
      </Helmet>

      <div className={`${styles.card} ${isAnimated ? styles.animated : ''}`}>
        {/* Animated 404 */}
        <div className={styles.errorCode}>
          <span className={styles.digit}>4</span>
          <div className={styles.zeroContainer}>
            <div className={styles.orbit}>
              <div className={styles.satellite}>🛰️</div>
            </div>
            <span className={styles.zero}>0</span>
          </div>
          <span className={styles.digit}>4</span>
        </div>

        <h1 className={styles.title}>Сторінку не знайдено</h1>
        <p className={styles.text}>
          Схоже, ви потрапили в невідомі простори інтернету. 
          Можливо, сторінка була переміщена, видалена або ви ввели неправильну адресу.
        </p>

        {/* Quick suggestions */}
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Куди б ви хотіли перейти?</h3>
          <div className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <Link 
                key={index} 
                to={suggestion.to} 
                className={styles.suggestionLink}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className={styles.suggestionIcon}>{suggestion.label}</span>
                <div className={styles.suggestionContent}>
                  <span className={styles.suggestionDescription}>
                    {suggestion.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className={styles.actions}>
          <button 
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            ⬅️ Назад
          </button>
          <Link to="/" className={styles.homeLink}>
            🏠 На головну
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;