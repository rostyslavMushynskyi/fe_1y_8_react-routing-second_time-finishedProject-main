import PropTypes from "prop-types";
import styles from "./HeroVideo.module.css";

function HeroVideo({ videoId = "U2Qp5pL3ovA", title = "Офіційний трейлер" }) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <section className={styles.section} aria-labelledby="hero-video-title">
      <div className={styles.header}>
        <h2 id="hero-video-title" className={styles.title}>
          Трейлер дня
        </h2>
        <p className={styles.subtitle}>{title}</p>
      </div>

      <div className={styles.videoWrapper}>
        <iframe
          className={styles.iframe}
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className={styles.caption}>
        <a
          className={styles.watchLink}
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Відкрити трейлер на YouTube у новій вкладці"
        >
          Дивитися на YouTube →
        </a>
      </div>
    </section>
  );
}

HeroVideo.propTypes = {
  videoId: PropTypes.string,
  title: PropTypes.string,
};

export default HeroVideo;