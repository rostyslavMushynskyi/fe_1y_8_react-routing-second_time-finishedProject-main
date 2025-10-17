import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMoviesReviews } from "../services/moviesService";
import { Oval } from "react-loader-spinner";
import styles from "./ReviewsPage.module.css";

function ReviewsPage() {
  const { movieId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getMoviesReviews(movieId)
      .then((res) => setReviews(res))
      .finally(() => setIsLoading(false));
  }, [movieId]);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Відгуки</h3>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Oval color="#4ecdc4" secondaryColor="rgba(255,255,255,0.3)" />
        </div>
      )}

      {reviews.length > 0 ? (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <h4 className={styles.author}>{review.author}</h4>
              <p className={styles.content}>{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Відгуків поки що немає</p>
            <p className={styles.emptyMessage}>
              Будьте першим, хто поділиться думкою!
            </p>
          </div>
        )
      )}
    </section>
  );
}

export default ReviewsPage;
