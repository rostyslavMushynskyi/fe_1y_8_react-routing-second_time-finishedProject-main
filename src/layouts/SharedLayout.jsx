import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SharedLayout() {
  const location = useLocation();

  // Гейт проти FOUC: перший кадр не малюємо, поки не встановимо initial-стилі
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    // На час переходу/першого маунта відключаємо внутрішні CSS-анімації, щоб не було "подвійної" анімації
    document.body.dataset.routeAnimating = "1";
    setMounted(true);
    // знімаємо атрибут після першої анімації в onAnimationComplete
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.main
            key={location.pathname}
            style={{ flex: 1, willChange: "opacity, filter" }}
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onAnimationStart={() => {
              // На кожному переході знову блокуємо внутрішні CSS-анімації у контенті сторінок
              document.body.dataset.routeAnimating = "1";
            }}
            onAnimationComplete={() => {
              // Після завершення — повертаємо анімації в норму
              delete document.body.dataset.routeAnimating;
            }}
          >
            <Outlet />
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default SharedLayout;
