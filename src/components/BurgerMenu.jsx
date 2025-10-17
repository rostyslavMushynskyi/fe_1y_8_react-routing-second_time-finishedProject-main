import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from './BurgerMenu.module.css';

const BurgerMenu = ({ isOpen, toggleMenu, className, noMargin = false }) => {
  return (
    <motion.button
      className={`${styles.burger} ${isOpen ? styles.open : ''} ${noMargin ? styles.noMargin : ''} ${className || ''}`}
      onClick={toggleMenu}
      aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
      aria-expanded={isOpen}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      {isOpen ? (
        <svg
          className={styles.iconX}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </>
      )}
    </motion.button>
  );
};

BurgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  className: PropTypes.string,
  noMargin: PropTypes.bool,
};

export default BurgerMenu;
