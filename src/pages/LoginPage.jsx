import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Oval } from "react-loader-spinner";
import { useAuth } from "../contexts/AuthContext";
import { initiateAuth, completeAuth } from "../services/authService";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // guard від подвійного виклику (інколи ефекти тригеряться двічі)
  const handledRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleAuthComplete = useCallback(async () => {
    if (handledRef.current) return;
    handledRef.current = true;

    setIsLoading(true);
    setError("");

    try {
      // 2) Беремо request_token з URL і передаємо в completeAuth
      const requestTokenFromUrl = searchParams.get("request_token");
      const result = await completeAuth(requestTokenFromUrl);

      if (result.success) {
        await login(result.sessionId, result.userData);
        navigate("/", { replace: true });
      } else {
        setError(result.error || "Помилка завершення авторизації");
      }
    } catch (err) {
      setError("Помилка при завершенні авторизації");
      console.error("Auth completion error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate, searchParams]);

  useEffect(() => {
    const approved = searchParams.get("approved");
    const requestToken = searchParams.get("request_token");

    if (approved === "true" && requestToken) {
      handleAuthComplete();
    }
  }, [searchParams, handleAuthComplete]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const redirectUrl = `${window.location.origin}/login`;
      const result = await initiateAuth(redirectUrl);

      if (result.success) {
        window.location.href = result.authUrl;
      } else {
        setError(result.error || "Помилка ініціації авторизації");
      }
    } catch (err) {
      setError("Непередбачена помилка. Спробуйте ще раз.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Вхід | MovieRate</title>
      </Helmet>

      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Вхід до MovieRate</h1>
          <p className={styles.subtitle}>
            Увійдіть через ваш аккаунт The Movie Database (TMDb) для доступу до
            персональних функцій
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.loginSection}>
          {isLoading ? (
            <div className={styles.loading}>
              <Oval
                color="#646cff"
                secondaryColor="#242424"
                height={40}
                width={40}
              />
              <span>Авторизація...</span>
            </div>
          ) : (
            <button
              className={styles.loginButton}
              onClick={handleLogin}
              disabled={isLoading}
            >
              <span className={styles.tmdbIcon}>🎬</span>
              Увійти через TMDb
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
