import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { atmAPI } from '../services/api';
import Alert from '../components/Alert';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 50000];

const Deposit = ({ darkMode }) => {
  const { user, updateUserBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newBalance, setNewBalance] = useState(null);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setNewBalance(null);

    const parsed = parseFloat(amount);
    if (!parsed || isNaN(parsed) || parsed <= 0) {
      setAlert({ type: 'warning', message: 'Please enter a valid amount greater than ₹0.' });
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await atmAPI.deposit({ amount: parsed });
      setNewBalance(data.balance);
      updateUserBalance(data.balance);
      setAlert({ type: 'success', message: data.message });
      setAmount('');
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Deposit failed. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-vh-100 py-4 ${darkMode ? 'dark-bg' : 'page-bg'}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            <div className="d-flex align-items-center gap-2 mb-4">
              <Link to="/dashboard" className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
                <i className="bi bi-arrow-left"></i>
              </Link>
              <div>
                <h4 className={`mb-0 fw-bold ${darkMode ? 'text-light' : ''}`}>Deposit Money</h4>
                <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                  Add funds to your account
                </small>
              </div>
            </div>

            {/* Balance Banner */}
            <div className="current-balance-banner rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
              <div className="balance-icon">
                <i className="bi bi-wallet2"></i>
              </div>
              <div>
                <small className="opacity-75">Current Balance</small>
                <h5 className="mb-0 fw-bold">
                  {formatCurrency(newBalance ?? user?.balance ?? 0)}
                </h5>
              </div>
            </div>

            <div className={`card border-0 rounded-4 shadow-sm ${darkMode ? 'dark-card' : ''}`}>
              <div className="card-body p-4">
                {alert && (
                  <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className={`form-label fw-semibold ${darkMode ? 'text-light' : ''}`}>
                      Deposit Amount
                    </label>
                    <div className="input-group input-group-lg">
                      <span className={`input-group-text fw-bold ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                        ₹
                      </span>
                      <input
                        type="number"
                        className={`form-control ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Quick Select */}
                  <div className="mb-4">
                    <label className={`form-label small ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                      Quick Select
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {QUICK_AMOUNTS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          className={`btn btn-sm ${amount == q ? 'btn-success' : darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                          onClick={() => setAmount(q)}
                        >
                          ₹{q.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-semibold rounded-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-down-circle me-2"></i>
                        Deposit {amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : 'Funds'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Info */}
            <div className={`card border-0 rounded-4 mt-3 ${darkMode ? 'dark-card' : 'bg-light'}`}>
              <div className="card-body p-3">
                <p className={`small mb-1 fw-semibold ${darkMode ? 'text-light' : ''}`}>
                  <i className="bi bi-info-circle me-1 text-info"></i>Deposit Info
                </p>
                <ul className={`small mb-0 ps-3 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                  <li>Minimum deposit: ₹1</li>
                  <li>Maximum per transaction: ₹10,00,000</li>
                  <li>Balance updates instantly</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
