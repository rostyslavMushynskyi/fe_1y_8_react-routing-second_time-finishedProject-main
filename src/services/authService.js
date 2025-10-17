import axios from "axios";

// 1) Глобальна конфігурація TMDb API
axios.defaults.baseURL = "https://api.themoviedb.org/3";

const V4_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const V3_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (V4_TOKEN) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${V4_TOKEN}`;
  axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";
} else if (V3_KEY) {
  // якщо немає v4-токена, підставляємо v3 api_key у кожен запит
  axios.interceptors.request.use((config) => {
    config.params = config.params || {};
    if (!("api_key" in config.params)) {
      config.params.api_key = V3_KEY;
    }
    return config;
  });
}

export function createRequestToken() {
  return axios.get("/authentication/token/new").then((response) => {
    return {
      success: response.data.success,
      token: response.data.request_token,
      expiresAt: response.data.expires_at,
    };
  });
}

export function getAuthorizationUrl(requestToken, redirectUrl = null) {
  const baseUrl = `https://www.themoviedb.org/authenticate/${requestToken}`;
  return redirectUrl
    ? `${baseUrl}?redirect_to=${encodeURIComponent(redirectUrl)}`
    : baseUrl;
}

export function createSession(requestToken) {
  return axios
    .post("/authentication/session/new", {
      request_token: requestToken,
    })
    .then((response) => {
      return {
        success: response.data.success,
        sessionId: response.data.session_id,
      };
    });
}

export function deleteSession(sessionId) {
  return axios
    .delete("/authentication/session", {
      data: { session_id: sessionId },
    })
    .then((response) => ({ success: response.data.success }));
}

export function validateApiKey() {
  return axios.get("/authentication").then((response) => {
    return {
      success: response.data.success,
      statusCode: response.data.status_code,
      statusMessage: response.data.status_message,
    };
  });
}

export function getAccountDetails(sessionId) {
  return axios
    .get("/account", { params: { session_id: sessionId } })
    .then((response) => {
      console.log("Account details from API:", response.data);
      return response.data;
    });
}

export function getMovieAccountStates(movieId, sessionId) {
  return axios
    .get(`/movie/${movieId}/account_states`, {
      params: { session_id: sessionId },
    })
    .then((response) => response.data);
}

export const authStorage = {
  setSessionId(sessionId) {
    localStorage.setItem("tmdb_session_id", sessionId);
  },
  getSessionId() {
    return localStorage.getItem("tmdb_session_id");
  },
  removeSessionId() {
    localStorage.removeItem("tmdb_session_id");
  },
  setRequestToken(token) {
    localStorage.setItem("tmdb_request_token", token);
  },
  getRequestToken() {
    return localStorage.getItem("tmdb_request_token");
  },
  removeRequestToken() {
    localStorage.removeItem("tmdb_request_token");
  },
  setUserData(userData) {
    localStorage.setItem("tmdb_user_data", JSON.stringify(userData));
  },
  getUserData() {
    const userData = localStorage.getItem("tmdb_user_data");
    return userData ? JSON.parse(userData) : null;
  },
  removeUserData() {
    localStorage.removeItem("tmdb_user_data");
  },
  clearAll() {
    this.removeSessionId();
    this.removeRequestToken();
    this.removeUserData();
  },
};

export function isAuthenticated() {
  return !!authStorage.getSessionId();
}

// 2) Приймаємо request_token з URL (fallback — з localStorage)
export async function initiateAuth(redirectUrl) {
  try {
    const tokenData = await createRequestToken();
    if (!tokenData.success) throw new Error("Failed to create request token");

    authStorage.setRequestToken(tokenData.token);
    const authUrl = getAuthorizationUrl(tokenData.token, redirectUrl);

    return {
      success: true,
      authUrl,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
    };
  } catch (error) {
    console.error("Auth initiation failed:", error);
    return { success: false, error: error.message };
  }
}

export async function completeAuth(requestTokenFromUrl = null) {
  try {
    const requestToken = requestTokenFromUrl || authStorage.getRequestToken();
    if (!requestToken) throw new Error("No request token found");

    const sessionData = await createSession(requestToken);
    if (!sessionData.success) throw new Error("Failed to create session");

    authStorage.setSessionId(sessionData.sessionId);

    const userData = await getAccountDetails(sessionData.sessionId);
    authStorage.setUserData(userData);

    authStorage.removeRequestToken();

    return { success: true, sessionId: sessionData.sessionId, userData };
  } catch (error) {
    console.error("Auth completion failed:", error);
    authStorage.clearAll();
    return { success: false, error: error.message };
  }
}

export async function logout() {
  try {
    const sessionId = authStorage.getSessionId();
    if (sessionId) await deleteSession(sessionId);
    authStorage.clearAll();
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    authStorage.clearAll();
    return { success: false, error: error.message };
  }
}

// ========== УЛЮБЛЕНІ ==========

function getAccountId() {
  const userData = authStorage.getUserData();
  return userData?.id || null;
}

// 3) Самовідновлення account_id, якщо відсутній у кеші
async function ensureAccountId(sessionId) {
  const cached = getAccountId();
  if (cached) return cached;
  if (!sessionId) throw new Error("User not authenticated");
  const user = await getAccountDetails(sessionId);
  authStorage.setUserData(user);
  return user?.id;
}

export async function getFavoriteMovies(sessionId, page = 1) {
  const accountId = await ensureAccountId(sessionId);
  if (!accountId) throw new Error("User account ID not found");

  return axios
    .get(`/account/${accountId}/favorite/movies`, {
      params: { session_id: sessionId, page, sort_by: "created_at.desc" },
    })
    .then((response) => {
      return {
        totalCount: response.data.total_results,
        totalPages: response.data.total_pages,
        results: response.data.results,
        page: response.data.page,
      };
    });
}

export async function toggleFavoriteMovie(sessionId, movieId, favorite) {
  const accountId = await ensureAccountId(sessionId);

  console.log("AuthService toggleFavoriteMovie:", {
    sessionId: sessionId ? "✅ Present" : "❌ Missing",
    accountId,
    movieId,
    favorite,
  });

  if (!accountId) throw new Error("User account ID not found");

  const url = `/account/${accountId}/favorite`;
  const data = { media_type: "movie", media_id: movieId, favorite };

  console.log("Making API request:", { url, data, sessionId });

  return axios
    .post(url, data, { params: { session_id: sessionId } })
    .then((response) => {
      console.log("API Response:", response.data);
      return {
        success: response.data.success,
        statusCode: response.data.status_code,
        statusMessage: response.data.status_message,
      };
    })
    .catch((error) => {
      console.error("API Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    });
}

export function addToFavorites(sessionId, movieId) {
  return toggleFavoriteMovie(sessionId, movieId, true);
}

export function removeFromFavorites(sessionId, movieId) {
  return toggleFavoriteMovie(sessionId, movieId, false);
}

export async function isMovieFavorite(sessionId, movieId) {
  try {
    const accountStates = await getMovieAccountStates(movieId, sessionId);
    return accountStates.favorite || false;
  } catch (error) {
    console.error("Failed to check favorite status:", error);
    return false;
  }
}
