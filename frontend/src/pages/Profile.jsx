import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { atmAPI } from '../services/api';
import Spinner from '../components/Spinner';

const Profile = ({ darkMode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await atmAPI.getProfile();
        setProfile(data);
      } catch {
        // Fallback to stored user data
        setProfile({ user, transactionCount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner text="Loading profile..." />
      </div>
    );
  }

  const u = profile?.user || user;

  return (
    <div className={`min-vh-100 py-4 ${darkMode ? 'dark-bg' : 'page-bg'}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            <div className="d-flex align-items-center gap-2 mb-4">
              <Link to="/dashboard" className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
                <i className="bi bi-arrow-left"></i>
              </Link>
              <h4 className={`mb-0 fw-bold ${darkMode ? 'text-light' : ''}`}>My Profile</h4>
            </div>

            {/* Avatar Card */}
            <div className={`card border-0 rounded-4 shadow-sm mb-3 ${darkMode ? 'dark-card' : ''}`}>
              <div className="card-body p-4 text-center">
                <div className="profile-avatar mx-auto mb-3">
                  <span className="fw-bold fs-1">
                    {u?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h5 className={`fw-bold mb-1 ${darkMode ? 'text-light' : ''}`}>{u?.name}</h5>
                <p className={darkMode ? 'text-light opacity-75' : 'text-muted'}>{u?.email}</p>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                  <i className="bi bi-shield-check me-1"></i>Verified Account
                </span>
              </div>
            </div>

            {/* Account Details */}
            <div className={`card border-0 rounded-4 shadow-sm mb-3 ${darkMode ? 'dark-card' : ''}`}>
              <div className="card-body p-4">
                <h6 className={`fw-bold mb-3 ${darkMode ? 'text-light' : ''}`}>
                  <i className="bi bi-person-lines-fill me-2 text-primary"></i>Account Details
                </h6>
                <div className="row g-3">
                  {[
                    { label: 'Account Number', value: u?.accountNumber, icon: 'bi-credit-card' },
                    { label: 'Current Balance', value: formatCurrency(u?.balance ?? 0), icon: 'bi-wallet2' },
                    { label: 'Total Transactions', value: profile?.transactionCount || 0, icon: 'bi-arrow-left-right' },
                    { label: 'Member Since', value: u?.createdAt ? formatDate(u.createdAt) : 'N/A', icon: 'bi-calendar3' },
                    { label: 'Last Login', value: u?.lastLogin ? formatDate(u.lastLogin) : 'First session', icon: 'bi-clock' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="col-12">
                      <div className={`d-flex align-items-center gap-3 p-3 rounded-3 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
                        <i className={`bi ${icon} text-primary fs-5`}></i>
                        <div>
                          <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>{label}</small>
                          <p className={`mb-0 fw-semibold ${darkMode ? 'text-light' : ''}`}>{value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`card border-0 rounded-4 shadow-sm ${darkMode ? 'dark-card' : ''}`}>
              <div className="card-body p-4">
                <h6 className={`fw-bold mb-3 ${darkMode ? 'text-light' : ''}`}>
                  <i className="bi bi-lightning me-2 text-warning"></i>Quick Actions
                </h6>
                <div className="d-flex flex-column gap-2">
                  <Link to="/change-password" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} text-start`}>
                    <i className="bi bi-lock me-2"></i>Change Password
                  </Link>
                  <Link to="/history" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'} text-start`}>
                    <i className="bi bi-clock-history me-2"></i>View Transaction History
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
