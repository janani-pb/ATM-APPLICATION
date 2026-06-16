import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Alert from '../components/Alert';

const ChangePassword = ({ darkMode }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false });
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setAlert({ type: 'warning', message: 'All fields are required.' });
      return;
    }
    if (form.newPassword.length < 6) {
      setAlert({ type: 'warning', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setAlert({ type: 'warning', message: 'New passwords do not match.' });
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setAlert({ type: 'warning', message: 'New password must differ from current password.' });
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setAlert({ type: 'success', message: data.message });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-vh-100 py-4 ${darkMode ? 'dark-bg' : 'page-bg'}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">

            <div className="d-flex align-items-center gap-2 mb-4">
              <Link to="/profile" className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
                <i className="bi bi-arrow-left"></i>
              </Link>
              <div>
                <h4 className={`mb-0 fw-bold ${darkMode ? 'text-light' : ''}`}>Change Password</h4>
                <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                  Keep your account secure
                </small>
              </div>
            </div>

            <div className={`card border-0 rounded-4 shadow-sm ${darkMode ? 'dark-card' : ''}`}>
              <div className="card-body p-4">
                {alert && (
                  <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                )}

                <form onSubmit={handleSubmit}>
                  {[
                    { name: 'currentPassword', label: 'Current Password', key: 'current' },
                    { name: 'newPassword', label: 'New Password', key: 'new' },
                    { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
                  ].map(({ name, label, key }) => (
                    <div className="mb-3" key={name}>
                      <label className={`form-label fw-semibold ${darkMode ? 'text-light' : ''}`}>
                        {label}
                      </label>
                      <div className="input-group">
                        <span className={`input-group-text ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPwd[key] ? 'text' : 'password'}
                          name={name}
                          className={`form-control ${darkMode ? 'bg-dark-input border-secondary text-light' : ''} ${
                            name === 'confirmPassword' && form.confirmPassword && form.newPassword !== form.confirmPassword
                              ? 'is-invalid'
                              : ''
                          }`}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          value={form[name]}
                          onChange={handleChange}
                          required
                        />
                        {key !== 'confirm' && (
                          <button
                            type="button"
                            className={`input-group-text btn ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                            onClick={() => setShowPwd((p) => ({ ...p, [key]: !p[key] }))}
                          >
                            <i className={`bi ${showPwd[key] ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mt-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-lock me-2"></i>
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className={`card border-0 rounded-4 mt-3 ${darkMode ? 'dark-card' : 'bg-light'}`}>
              <div className="card-body p-3">
                <p className={`small mb-1 fw-semibold ${darkMode ? 'text-light' : ''}`}>
                  <i className="bi bi-shield-check me-1 text-success"></i>Password Tips
                </p>
                <ul className={`small mb-0 ps-3 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                  <li>Use at least 6 characters</li>
                  <li>Mix letters, numbers, and symbols</li>
                  <li>Don't reuse old passwords</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
