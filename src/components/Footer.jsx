import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.brandSection}>
            <Logo size="small" />
            <p className={styles.description}>
              Ваш надійний путівник у світі кіно. Відкривайте, оцінюйте та
              зберігайте найкращі фільми.
            </p>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.linkTitle}>Навігація</h4>
            <nav className={styles.footerNav}>
              <Link to="/" className={styles.footerLink}>
                Головна
              </Link>
              <Link to="/movies" className={styles.footerLink}>
                Фільми
              </Link>
              <Link to="/favorites" className={styles.footerLink}>
                Улюблені
              </Link>
              <Link to="/profile" className={styles.footerLink}>
                Профіль
              </Link>
            </nav>
          </div>


          <div className={styles.infoSection}>
            <h4 className={styles.linkTitle}>Проект</h4>
            <nav className={styles.footerNav}>
              <Link to="/author" className={styles.footerLink}>
                Про автора
              </Link>
              <a
                href="https://github.com/rostyslavMushynskyi/fe_1y_8_react-routing-second_time/tree/TEST"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                GitHub
              </a>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                TMDb API
              </a>
            </nav>
          </div>

          <div className={styles.techSection}>
            <h4 className={styles.linkTitle}>Технології</h4>
            <div className={styles.techTags}>
              <span className={styles.techTag}>React</span>
              <span className={styles.techTag}>Router</span>
              <span className={styles.techTag}>CSS Modules</span>
              <span className={styles.techTag}>Vite</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>© {currentYear} MovieRate.</p>
            <p style={{ marginTop: 6, fontSize: "0.85rem" }}>
              Цей продукт використовує API The Movie Database (TMDb), але не
              є афілійованим з TMDb або їх партнерами.
            </p>
          </div>

          <div className={styles.authorCredit}>
            <Link to="/author" className={styles.authorLink}>
              © Ростислав Мушинський
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
