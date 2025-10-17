import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMoviesCast } from "../services/moviesService";
import { Oval } from "react-loader-spinner";
import styles from "./CastPage.module.css";

function CastPage() {
  const { movieId } = useParams();

  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getMoviesCast(movieId)
      .then((res) => setCredits(res))
      .finally(() => setIsLoading(false));
  }, [movieId]);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Акторський склад</h3>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Oval color="#4ecdc4" secondaryColor="rgba(255,255,255,0.3)" />
        </div>
      )}

      {credits.length > 0 ? (
        <ul className={styles.castGrid}>
          {credits.map((actor) => (
            <li key={actor.id} className={styles.actorCard}>
              {actor.profile_path ? (
                <img
                  className={styles.profile}
                  src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                  alt={actor.name}
                />
              ) : (
                <div className={styles.profilePlaceholder}>🎭</div>
              )}
              <div className={styles.content}>
                <h4 className={styles.actorName}>{actor.name}</h4>
                <p className={styles.character}>Персонаж: {actor.character}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Інформація про акторів відсутня</p>
          </div>
        )
      )}
    </section>
  );
}

export default CastPage;
