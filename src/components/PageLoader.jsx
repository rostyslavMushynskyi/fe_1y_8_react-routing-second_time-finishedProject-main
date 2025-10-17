import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

function PageLoader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background:
              "linear-gradient(135deg, rgba(13,17,36,0.75), rgba(26,28,56,0.75))",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Завантаження...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageLoader;
PageLoader.propTypes = {
  show: PropTypes.bool,
};
