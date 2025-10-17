import { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import {
  isAuthenticated,
  authStorage,
  getAccountDetails,
  logout as logoutService,
} from "../services/authService";
import {
  clearFavoritesData,
  getFavorites,
  setFavoritesCount,
} from "../services/favoritesService";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  sessionId: null,
  loading: true,
  error: null,
};

const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        sessionId: action.payload.sessionId,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        sessionId: null,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        sessionId: null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      if (isAuthenticated()) {
        const sessionId = authStorage.getSessionId();
        const userData = authStorage.getUserData();

        if (sessionId && userData) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              sessionId,
              user: userData,
            },
          });

          // Оновлюємо кількість улюблених фільмів при ініціалізації
          try {
            const favoritesResult = await getFavorites(1);
            const favoritesCount = favoritesResult?.totalCount || 0;
            setFavoritesCount(favoritesCount);
          } catch (favError) {
            console.error("Failed to fetch favorites after init:", favError);
            setFavoritesCount(0);
          }
        } else if (sessionId) {
          try {
            const userData = await getAccountDetails(sessionId);
            authStorage.setUserData(userData);

            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                sessionId,
                user: userData,
              },
            });

            // Оновлюємо кількість улюблених фільмів після валідації сесії
            try {
              const favoritesResult = await getFavorites(1);
              const favoritesCount = favoritesResult?.totalCount || 0;
              setFavoritesCount(favoritesCount);
            } catch (favError) {
              console.error(
                "Failed to fetch favorites after session validation:",
                favError
              );
              setFavoritesCount(0);
            }
          } catch (error) {
            console.error("Session validation failed:", error);
            authStorage.clearAll();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: "Помилка ініціалізації авторизації",
      });
    }
  };

  const login = async (sessionId, userData = null) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      let user = userData;

      if (!user) {
        user = await getAccountDetails(sessionId);
      }

      authStorage.setSessionId(sessionId);
      authStorage.setUserData(user);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          sessionId,
          user,
        },
      });

      // Оновлюємо кількість улюблених фільмів після логіну
      try {
        const favoritesResult = await getFavorites(1);
        const favoritesCount = favoritesResult?.totalCount || 0;
        setFavoritesCount(favoritesCount);
      } catch (favError) {
        console.error("Failed to fetch favorites after login:", favError);
        setFavoritesCount(0);
      }

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message || "Помилка входу",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      await logoutService();
      clearFavoritesData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      clearFavoritesData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: false, error: error.message };
    }
  };

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });

    const currentUser = authStorage.getUserData();
    const updatedUser = { ...currentUser, ...userData };
    authStorage.setUserData(updatedUser);
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const checkAuth = () => {
    return state.isAuthenticated && !!state.sessionId;
  };

  const getCurrentUser = () => {
    return state.user;
  };

  const getSessionId = () => {
    return state.sessionId;
  };

  const contextValue = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    checkAuth,
    getCurrentUser,
    getSessionId,
    initializeAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AUTH_ACTIONS };
