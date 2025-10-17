import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getMovieVideos } from "../services/moviesService";
import styles from "./TrailerPlayer.module.css";

function TrailerPlayer({ movieId, movieTitle }) {
  const [trailers, setTrailers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    const loadTrailers = async () => {
      setIsLoading(true);
      try {
        const videos = await getMovieVideos(movieId);
        setTrailers(videos);
        if (videos.length > 0) {
          setSelectedTrailer(videos[0]);
        }
      } catch (error) {
        console.error("Failed to load trailers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      loadTrailers();
    }
  }, [movieId]);

  if (isLoading) {
    return <div className={styles.loading}>Завантаження трейлерів...</div>;
  }

  if (trailers.length === 0) {
    return <div className={styles.noTrailers}>Трейлери не знайдено</div>;
  }

  return (
    <div className={styles.trailerPlayer}>
      <h3 className={styles.title}>Трейлери - {movieTitle}</h3>

      {selectedTrailer && (
        <div className={styles.videoContainer}>
          <iframe
            src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
            title={selectedTrailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.video}
          />
        </div>
      )}

      {trailers.length > 1 && (
        <div className={styles.trailerList}>
          <h4>Інші трейлери:</h4>
          <ul>
            {trailers.map((trailer) => (
              <li key={trailer.id}>
                <button
                  onClick={() => setSelectedTrailer(trailer)}
                  className={`${styles.trailerButton} ${
                    selectedTrailer?.key === trailer.key ? styles.active : ""
                  }`}
                >
                  {trailer.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

TrailerPlayer.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  movieTitle: PropTypes.string.isRequired,
};

export default TrailerPlayer;
