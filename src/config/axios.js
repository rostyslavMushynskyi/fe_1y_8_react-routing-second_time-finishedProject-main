import axios from "axios";

const apiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZGRiODJiNjA5ZjA5MWQ0ODllOGE5ZDk0ZTFmNTkyYiIsIm5iZiI6MTY5NTc0OTYxMC44NjYsInN1YiI6IjY1MTMxNWVhMjZkYWMxMDBlYjFiZTIxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K3q_AA0yl01QtAZ1FeEYHOj1fr554t2ERlOE8eN5d5Y";

axios.defaults.baseURL = "https://api.themoviedb.org/3";
// Ensure Authorization header is set for all requests
axios.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;
axios.defaults.headers.common["Accept"] = "application/json";
