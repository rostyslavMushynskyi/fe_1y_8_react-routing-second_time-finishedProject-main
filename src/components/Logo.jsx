import styles from "./Logo.module.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Logo({ size = "medium" }) {
  return (
    <Link to="/" className={`${styles.logoLink} ${styles[size]}`}>
      <div className={styles.logoContainer}>
        <svg
          viewBox="0 0 32 32"
          className={styles.logoIcon}
          aria-label="MovieRate логотип"
        >
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#1f2937", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#374151", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="clapper-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#667eea", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#764ba2", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          {/* Main clapper body */}
          <rect
            x="4"
            y="12"
            width="24"
            height="14"
            rx="2"
            fill="url(#logo-gradient)"
            stroke="#ffffff"
            strokeWidth="1"
          />

          {/* Clapper top part */}
          <path
            d="M6 12 L26 12 L24 6 L8 6 Z"
            fill="url(#clapper-gradient)"
            stroke="#ffffff"
            strokeWidth="1"
          />

          {/* Clapper stripes */}
          <rect x="8" y="6" width="3" height="6" fill="#ffffff" opacity="0.9" />
          <rect
            x="13"
            y="6"
            width="3"
            height="6"
            fill="#1f2937"
            opacity="0.8"
          />
          <rect
            x="18"
            y="6"
            width="3"
            height="6"
            fill="#ffffff"
            opacity="0.9"
          />

          {/* Movie rating star */}
          <path
            d="M16 15 L17 18 L20 18 L17.5 20 L18.5 23 L16 21 L13.5 23 L14.5 20 L12 18 L15 18 Z"
            fill="#ffd700"
            stroke="#ffffff"
            strokeWidth="0.3"
          />

          {/* Film strip holes */}
          <circle cx="6" cy="16" r="1" fill="#4b5563" />
          <circle cx="6" cy="20" r="1" fill="#4b5563" />
          <circle cx="26" cy="16" r="1" fill="#4b5563" />
          <circle cx="26" cy="20" r="1" fill="#4b5563" />
        </svg>

        <span className={styles.logoText}>
          <span className={styles.movieText}>Movie</span>
          <span className={styles.rateText}>Rate</span>
        </span>
      </div>
    </Link>
  );
}

Logo.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default Logo;
