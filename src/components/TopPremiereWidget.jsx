import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { fetchTopPremiere } from "../services/premiereService";
import { motion } from "framer-motion";
import styles from "./TopPremiereWidget.module.css";

// Надійний форматувач: приймає YYYY-MM-DD або будь-який ISO, інакше повертає рядок як є
function fmtDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) {
    const y = +m[1],
      mo = +m[2],
      d = +m[3];
    const dt = new Date(y, mo - 1, d); // без TZ-зсувів
    if (!Number.isNaN(dt.getTime())) {
      return dt.toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  const dt = new Date(s);
  if (!Number.isNaN(dt.getTime())) {
    return dt.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return s; // у крайньому разі показуємо як є, не "Invalid Date"
}

export default function TopPremiereWidget({ region = "UA", days = 14 }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");
    fetchTopPremiere({ region, days, language: "uk-UA", cacheHours: 12 })
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((e) => {
        if (mounted) setErr(e?.message || "Помилка завантаження");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [region, days]);

  const trailerUrl =
    data?.trailer?.site === "YouTube" && data?.trailer?.key
      ? `https://www.youtube.com/watch?v=${data.trailer.key}`
      : null;

  // Ось тут обчислюємо дату, і потім використовуємо її в JSX нижче
  const dateLabel = data?.regionalReleaseDate
    ? fmtDate(data.regionalReleaseDate)
    : data?.release_date
    ? fmtDate(data.release_date)
    : null;

  return (
    <section className={styles.section} aria-label="Найпопулярніша прем’єра">
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        🎟️ Найпопулярніша прем’єра найближчим часом
      </motion.h2>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.skeletonPoster} />
          <div className={styles.skeletonLines}>
            <div className={styles.skelLine} />
            <div className={styles.skelLine} />
            <div className={styles.skelLineShort} />
          </div>
        </div>
      )}

      {!loading && err && (
        <div className={styles.error}>
          <span>⚠️ {err}</span>
        </div>
      )}

      {!loading && !err && data && (
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, filter: "blur(10px)", y: 14 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Link to={`/movie/${data.id}`} className={styles.posterWrap}>
            {data.poster_path ? (
              <img
                className={styles.poster}
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                alt={`Постер фільму "${data.title}"`}
                loading="lazy"
              />
            ) : (
              <div className={styles.posterPlaceholder}>🎬</div>
            )}
            {data.vote_average > 0 && (
              <div className={styles.badge}>{data.vote_average.toFixed(1)}</div>
            )}
          </Link>

          <div className={styles.info}>
            <Link to={`/movie/${data.id}`} className={styles.movieTitle}>
              {data.title}
            </Link>

            <div className={styles.meta}>
              {dateLabel && (
                <span className={styles.date}>Прем’єра: {dateLabel}</span>
              )}
              {data.popularity ? (
                <span className={styles.popularity}>
                  Популярність: {Math.round(data.popularity)}
                </span>
              ) : null}
            </div>

            {data.overview && (
              <p className={styles.overview}>{data.overview}</p>
            )}

            <div className={styles.actions}>
              <Link to={`/movie/${data.id}`} className={styles.detailsBtn}>
                Детальніше
              </Link>
              {trailerUrl && (
                <a
                  className={styles.trailerBtn}
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Дивитись трейлер
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

TopPremiereWidget.propTypes = {
  region: PropTypes.string,
  days: PropTypes.number,
};
