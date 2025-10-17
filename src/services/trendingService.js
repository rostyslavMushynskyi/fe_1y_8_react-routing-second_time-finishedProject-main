import axios from "axios";

export function getTrendingService(page) {
  return axios
    .get("/trending/movie/day", {
      params: {
        sort: "rating",
        order: "desc",
        page: page,
        limit: 8,
        include_adult: false, // Виключаємо дорослий контент
      },
    })
    .then((res) => res.data);
}
