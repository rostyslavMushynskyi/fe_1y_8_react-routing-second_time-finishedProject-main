import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import NavbarLink from "./NavbarLink";
import Logo from "./Logo";
import BurgerMenu from "./BurgerMenu";

function Navbar() {
  const { isAuthenticated, user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Блокування скролу body при відкритому меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Закриття меню при натисканні Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  // Зміна стилю навбару при скролі
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContent}>
          <div className={styles.leftSection}>
            <Logo size="medium" />
            <div className={styles.navigationLinks}>
              <NavbarLink to="/">Головна</NavbarLink>
              <NavbarLink to="/movies">Фільми</NavbarLink>
              {isAuthenticated && (
                <>
                  <NavbarLink to="/favorites">Улюблені</NavbarLink>
                  <NavbarLink to="/my-ratings">Мої оцінки</NavbarLink>
                </>
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            {loading ? (
              <div className={styles.loading}>...</div>
            ) : isAuthenticated ? (
              <>
                <span className={styles.welcome}>
                  Привіт, <span className={styles.username}>{user?.username || user?.name || "User"}</span>!
                </span>
                <NavbarLink to="/profile">Профіль</NavbarLink>
              </>
            ) : (
              <NavbarLink to="/login">Вхід</NavbarLink>
            )}
            <BurgerMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
          </div>
        </div>
      </nav>

      {/* Overlay та мобільне меню рендеряться тільки коли меню відкрите */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay для закриття меню при кліку поза ним */}
          <div 
            className={styles.overlay} 
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Мобільне меню */}
          <div className={`${styles.mobileMenu} ${styles.open}`} role="dialog" aria-modal="true">
            <div className={styles.mobileMenuContent}>
              <div className={styles.mobileHeader}>
                <BurgerMenu
                  isOpen={true}
                  toggleMenu={closeMobileMenu}
                  className={styles.closeButton}
                  noMargin
                />
                {isAuthenticated && (
                  <div className={styles.welcomeMobile}>
                    Привіт, <span className={styles.username}>{user?.username || user?.name || "User"}</span>!
                  </div>
                )}
              </div>
              <div className={styles.mobileNavigationLinks}>
                <NavbarLink to="/" onClick={closeMobileMenu}>Головна</NavbarLink>
                <NavbarLink to="/movies" onClick={closeMobileMenu}>Фільми</NavbarLink>
                {isAuthenticated ? (
                  <>
                    <NavbarLink to="/favorites" onClick={closeMobileMenu}>Улюблені</NavbarLink>
                    <NavbarLink to="/my-ratings" onClick={closeMobileMenu}>Мої оцінки</NavbarLink>
                    <NavbarLink to="/profile" onClick={closeMobileMenu}>Профіль</NavbarLink>
                  </>
                ) : (
                  <NavbarLink to="/login" onClick={closeMobileMenu}>Вхід</NavbarLink>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;