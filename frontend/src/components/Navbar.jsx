import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar navbar-expand-lg shadow-sm ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white border-bottom'}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/dashboard">
            <div className="brand-icon">
              <i className="bi bi-bank2"></i>
            </div>
            <span className="brand-text">NexaBank</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {user && (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/dashboard') ? 'active fw-semibold' : ''}`}
                    to="/dashboard"
                  >
                    <i className="bi bi-grid me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/deposit') ? 'active fw-semibold' : ''}`}
                    to="/deposit"
                  >
                    <i className="bi bi-arrow-down-circle me-1"></i>Deposit
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/withdraw') ? 'active fw-semibold' : ''}`}
                    to="/withdraw"
                  >
                    <i className="bi bi-arrow-up-circle me-1"></i>Withdraw
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/history') ? 'active fw-semibold' : ''}`}
                    to="/history"
                  >
                    <i className="bi bi-clock-history me-1"></i>History
                  </Link>
                </li>
              </ul>
            )}

            <div className="d-flex align-items-center gap-2 ms-auto">
              {/* Dark mode toggle */}
              <button
                className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                onClick={toggleDarkMode}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>

              {user && (
                <div className="dropdown">
                  <button
                    className={`btn btn-sm dropdown-toggle d-flex align-items-center gap-2 ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                    data-bs-toggle="dropdown"
                  >
                    <div className="avatar-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="d-none d-md-inline">{user.name.split(' ')[0]}</span>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end shadow ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/change-password">
                        <i className="bi bi-lock me-2"></i>Change Password
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className={`modal-content ${darkMode ? 'bg-dark text-light' : ''}`}>
              <div className="modal-body text-center p-4">
                <div className="logout-icon mb-3">
                  <i className="bi bi-box-arrow-right text-danger fs-1"></i>
                </div>
                <h6 className="fw-bold mb-2">Confirm Logout</h6>
                <p className={`small mb-3 ${darkMode ? 'text-light' : 'text-muted'}`}>
                  Are you sure you want to sign out of your account?
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
