import axios from "axios";

export function searchMoviesService(query, page, options = {}) {
  return axios
    .get("/search/movie", {
      params: {
        query: query,
        page: page,
        include_adult: false,
      },
      signal: options.signal,
    })
    .then((res) => {
      return {
        totalCount: res.data.total_results,
        totalPages: res.data.total_pages,
        results: res.data.results,
        page: res.data.page,
      };
    });
}

export function discoverMoviesService(filters = {}, page = 1, options = {}) {
  const params = {
    page: page,
    sort_by: filters.sortBy || "popularity.desc",
    include_adult: false,
  };

  if (filters.genres && filters.genres.length > 0) {
    params.with_genres = filters.genres.join(",");
  }

  if (filters.yearFrom) {
    params["primary_release_date.gte"] = `${filters.yearFrom}-01-01`;
  }
  if (filters.yearTo) {
    params["primary_release_date.lte"] = `${filters.yearTo}-12-31`;
  }

  if (filters.ratingMin) {
    params["vote_average.gte"] = filters.ratingMin;
  }
  if (filters.ratingMax) {
    params["vote_average.lte"] = filters.ratingMax;
  }

  params["vote_count.gte"] = 10;

  console.log("🔍 Discover API params:", params);

  return axios
    .get("/discover/movie", { params, signal: options.signal })
    .then((res) => {
      console.log("✅ Discover API response:", res.data);
      return {
        totalCount: res.data.total_results,
        totalPages: res.data.total_pages,
        results: res.data.results,
        page: res.data.page,
      };
    })
    .catch((error) => {
      console.error("❌ Discover API error:", error);
      throw error;
    });
}

export function getMoviesDetails(movieId) {
  return axios.get(`/movie/${movieId}`).then((res) => res.data);
}

export function getMoviesCast(movieId) {
  return axios.get(`/movie/${movieId}/credits`).then((res) => res.data.cast);
}

export function getMoviesReviews(movieId) {
  return axios.get(`/movie/${movieId}/reviews`).then((res) => res.data.results);
}

export function getMovieVideos(movieId) {
  return axios.get(`/movie/${movieId}/videos`).then((res) => {
    const videos = res.data.results;
    return videos.filter(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
  });
}
