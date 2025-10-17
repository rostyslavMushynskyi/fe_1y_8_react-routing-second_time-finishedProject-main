import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './NavbarLink.module.css';

function NavbarLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? styles.active : styles.link)}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}

NavbarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default NavbarLink;