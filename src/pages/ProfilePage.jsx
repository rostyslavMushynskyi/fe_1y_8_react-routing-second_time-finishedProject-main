import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Oval } from "react-loader-spinner";
import { useAuth } from "../contexts/AuthContext";
import {
  getFavoritesCount,
  getFavorites,
  setFavoritesCount,
} from "../services/favoritesService";
import { getRatingsStats } from "../services/ratingService";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [actualFavoritesCount, setActualFavoritesCount] = useState(() => {
    return isAuthenticated ? getFavoritesCount() : 0;
  });
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [ratingsStats, setRatingsStats] = useState(() => {
    return getRatingsStats();
  });
  const [memberSince, setMemberSince] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchFavoritesCount = async () => {
        setIsLoadingFavorites(true);
        try {
          const favoritesResult = await getFavorites(1);
          const actualCount = favoritesResult?.totalCount || 0;

          setActualFavoritesCount(actualCount);
          setFavoritesCount(actualCount);
          setRatingsStats(getRatingsStats());
        } catch (error) {
          console.error("Failed to fetch favorites count:", error);
        } finally {
          setIsLoadingFavorites(false);
        }
      };

      fetchFavoritesCount();
      
      // Обчислюємо дату реєстрації (симуляція)
      const registrationDate = new Date('2023-01-01').toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long'
      });
      setMemberSince(registrationDate);
    } else {
      setActualFavoritesCount(0);
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const quickActions = [
    {
      to: "/movies",
      icon: "🔍",
      title: "Знайти фільми",
      description: "Пошук нових фільмів"
    },
    {
      to: "/favorites",
      icon: "❤️",
      title: "Улюблені",
      description: `${actualFavoritesCount} фільмів`
    },
    {
      to: "/my-ratings",
      icon: "⭐",
      title: "Мої оцінки",
      description: `${ratingsStats.totalRated} оцінених`
    }
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <Oval color="#646cff" secondaryColor="#242424" height={50} width={50} />
        <span>Завантаження профілю...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Профіль | MovieRate</title>
        <meta 
          name="description" 
          content={`Профіль ${user.username} - перегляд статистики, улюблених фільмів та особистих рейтингів`} 
        />
      </Helmet>

      <div className={styles.profileCard}>
        {/* Header with user info */}
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            {user.avatar?.gravatar?.hash ? (
              <img
                src={`https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?s=150`}
                alt={user.username}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span>{user.username?.charAt(0).toUpperCase() || "U"}</span>
              </div>
            )}
            <div className={styles.onlineStatus}>
              <span className={styles.statusDot}></span>
              Онлайн
            </div>
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user.username}</h1>
            {user.name && <p className={styles.realName}>{user.name}</p>}
            <p className={styles.userId}>ID: {user.id}</p>
            <div className={styles.memberInfo}>
              <span className={styles.memberSince}>Користувач з {memberSince}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>❤️</div>
            <div className={styles.statContent}>
              <span className={`${styles.statNumber} ${isLoadingFavorites ? styles.loading : ""}`}>
                {isLoadingFavorites ? (
                  <span className={styles.loadingDots}>⟳</span>
                ) : (
                  <span key={actualFavoritesCount} className={styles.countNumber}>
                    {actualFavoritesCount}
                  </span>
                )}
              </span>
              <span className={styles.statLabel}>Обрані фільми</span>
              <Link to="/favorites" className={styles.statLink}>Переглянути →</Link>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{ratingsStats.totalRated}</span>
              <span className={styles.statLabel}>Оцінені фільми</span>
              <Link to="/my-ratings" className={styles.statLink}>Переглянути →</Link>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>
                {ratingsStats.totalRated > 0 ? ratingsStats.averageRating : "—"}
              </span>
              <span className={styles.statLabel}>Середня оцінка</span>
              <span className={styles.statDetails}>
                {ratingsStats.totalRated > 0 ? `Найвища: ${ratingsStats.highestRating}` : "Поки немає оцінок"}
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏆</div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{actualFavoritesCount + ratingsStats.totalRated}</span>
              <span className={styles.statLabel}>Загальна активність</span>
              <span className={styles.statDetails}>Всього взаємодій</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsSection}>
          <h3 className={styles.sectionTitle}>Швидкі дії</h3>
          <div className={styles.quickActions}>
            {quickActions.map((action, index) => (
              <Link key={index} to={action.to} className={styles.quickActionCard}>
                <div className={styles.actionIcon}>{action.icon}</div>
                <div className={styles.actionContent}>
                  <h4 className={styles.actionTitle}>{action.title}</h4>
                  <p className={styles.actionDescription}>{action.description}</p>
                </div>
                <div className={styles.actionArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Account Information */}
        <div className={styles.accountInfo}>
          <h3 className={styles.sectionTitle}>Інформація про аккаунт</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🌍</div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Країна</span>
                <span className={styles.infoValue}>{user.iso_3166_1 || "Не вказано"}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🗣️</div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Мова</span>
                <span className={styles.infoValue}>{user.iso_639_1 || "Не вказано"}</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🔗</div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Підключення</span>
                <span className={styles.infoValue}>TMDb API</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📅</div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Останній вхід</span>
                <span className={styles.infoValue}>Зараз активний</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsSection}>
          <h3 className={styles.sectionTitle}>Управління аккаунтом</h3>
          <div className={styles.actions}>
            <a
              href={`https://www.themoviedb.org/u/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionButton}
            >
              <span className={styles.actionButtonIcon}>🎬</span>
              Профіль на TMDb
            </a>

            <button className={styles.logoutButton} onClick={handleLogout}>
              <span className={styles.actionButtonIcon}>🚪</span>
              Вийти з аккаунту
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.profileFooter}>
          <p className={styles.footerText}>
            Дані синхронізуються з вашим профілем TMDb. 
            Зміни в оцінках і списках автоматично зберігаються.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;