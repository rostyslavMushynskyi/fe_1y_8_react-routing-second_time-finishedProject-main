import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchTrailerOfTheDay } from "../services/trailerOfTheDayService";
import HeroVideo from "./HeroVideo";
import { motion } from "framer-motion";
import styles from "./TrailerOfTheDay.module.css";

export default function TrailerOfTheDay({ region = "UA" }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");
    fetchTrailerOfTheDay({ region, language: "uk-UA", cacheHours: 6 })
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e?.message || "Не вдалося завантажити трейлер дня");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [region]);

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, filter: "blur(10px)", y: 12 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-label="Трейлер дня"
    >
      {loading && (
        <div className={styles.skeleton}>
          <div className={styles.skelVideo} />
          <div className={styles.skelLine} />
          <div className={styles.skelLineShort} />
        </div>
      )}

      {!loading && err && (
        <div className={styles.error}>
          <span>⚠️ {err}</span>
        </div>
      )}

      {!loading && !err && data?.videoKey ? (
        <HeroVideo videoId={data.videoKey} title={data.title || "Трейлер"} />
      ) : null}

      {!loading && !err && !data && (
        <div className={styles.empty}>
          <p>На жаль, сьогодні немає доступного трейлера. Спробуйте пізніше.</p>
        </div>
      )}
    </motion.section>
  );
}

TrailerOfTheDay.propTypes = {
  region: PropTypes.string,
};
