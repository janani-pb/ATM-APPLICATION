import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import Alert from '../components/Alert';

const Login = ({ darkMode }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!form.email || !form.password) {
      setAlert({ type: 'warning', message: 'Please fill in all fields.' });
      return;
    }

    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setAlert({ type: 'danger', message: result.message });
    }
  };

  return (
    <div className={`auth-page min-vh-100 d-flex align-items-center ${darkMode ? 'dark-bg' : 'auth-bg'}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4">

            <div className="text-center mb-4">
              <div className="auth-logo mb-3">
                <i className="bi bi-bank2"></i>
              </div>
              <h1 className={`fs-3 fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>NexaBank</h1>
              <p className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                Sign in to your account
              </p>
            </div>

            <div className={`card border-0 shadow-lg ${darkMode ? 'bg-dark-card' : ''}`}>
              <div className="card-body p-4">
                {alert && (
                  <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                  />
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className={`form-label fw-semibold ${darkMode ? 'text-light' : ''}`}>
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`form-label fw-semibold ${darkMode ? 'text-light' : ''}`}>
                      Password
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPwd ? 'text' : 'password'}
                        name="password"
                        className={`form-control ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className={`input-group-text btn ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                        onClick={() => setShowPwd((s) => !s)}
                      >
                        <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <hr className={darkMode ? 'border-secondary' : ''} />
                <p className={`text-center mb-0 small ${darkMode ? 'text-light' : 'text-muted'}`}>
                  Don't have an account?{' '}
                  <Link to="/signup" className="fw-semibold text-primary text-decoration-none">
                    Create one
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
