import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import Alert from '../components/Alert';

const Signup = ({ darkMode }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState(false);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim() || !form.email || !form.password || !form.confirmPassword) {
      return 'All fields are required.';
    }
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const error = validate();
    if (error) {
      setAlert({ type: 'warning', message: error });
      return;
    }

    setSubmitting(true);
    const result = await signup(form.name.trim(), form.email, form.password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setAlert({ type: 'danger', message: result.message });
    }
  };

  const pwdStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'danger', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: 'warning', width: '50%' };
    if (p.length < 12) return { label: 'Good', color: 'info', width: '75%' };
    return { label: 'Strong', color: 'success', width: '100%' };
  };

  const strength = pwdStrength();

  return (
    <div className={`auth-page min-vh-100 d-flex align-items-center ${darkMode ? 'dark-bg' : 'auth-bg'}`}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4">

            <div className="text-center mb-4">
              <div className="auth-logo mb-3">
                <i className="bi bi-bank2"></i>
              </div>
              <h1 className={`fs-3 fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>NexaBank</h1>
              <p className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                Open your account today
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
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                        placeholder="Your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

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
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
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
                        placeholder="Minimum 6 characters"
                        value={form.password}
                        onChange={handleChange}
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
                    {strength && (
                      <div className="mt-2">
                        <div className="progress" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar bg-${strength.color}`}
                            style={{ width: strength.width }}
                          />
                        </div>
                        <small className={`text-${strength.color}`}>{strength.label}</small>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className={`form-label fw-semibold ${darkMode ? 'text-light' : ''}`}>
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        className={`form-control ${darkMode ? 'bg-dark-input border-secondary text-light' : ''} ${
                          form.confirmPassword && form.password !== form.confirmPassword ? 'is-invalid' : ''
                        } ${
                          form.confirmPassword && form.password === form.confirmPassword ? 'is-valid' : ''
                        }`}
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <hr className={darkMode ? 'border-secondary' : ''} />
                <p className={`text-center mb-0 small ${darkMode ? 'text-light' : 'text-muted'}`}>
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                    Sign in
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

export default Signup;
