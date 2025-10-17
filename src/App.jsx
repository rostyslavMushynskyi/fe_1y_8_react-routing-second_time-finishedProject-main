import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import SharedLayout from "./layouts/SharedLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import ReviewsPage from "./pages/ReviewsPage";
import CastPage from "./pages/CastPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import MyRatingsPage from "./pages/MyRatingsPage";
import AuthorPage from "./pages/AuthorPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<SharedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-ratings" element={<MyRatingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />}>
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="cast" element={<CastPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
