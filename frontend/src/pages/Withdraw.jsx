import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { atmAPI } from '../services/api';
import Alert from '../components/Alert';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const Withdraw = ({ darkMode }) => {
  const { user, updateUserBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(user?.balance ?? 0);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const parsed = parseFloat(amount);
  const exceedsBalance = parsed > currentBalance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!parsed || isNaN(parsed) || parsed <= 0) {
      setAlert({ type: 'warning', message: 'Please enter a valid amount greater than ₹0.' });
      return;
    }
    if (exceedsBalance) {
      setAlert({ type: 'danger', message: `Insufficient funds. Your balance is ${formatCurrency(currentBalance)}.` });
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await atmAPI.withdraw({ amount: parsed });
      setCurrentBalance(data.balance);
      updateUserBalance(data.balance);
      setAlert({ type: 'success', message: data.message });
      setAmount('');
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Withdrawal failed. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const percentUsed = currentBalance > 0 ? Math.min(100, (parsed / currentBalance) * 100) : 0;

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
                <h4 className={`mb-0 fw-bold ${darkMode ? 'text-light' : ''}`}>Withdraw Money</h4>
                <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                  Take out funds from your account
                </small>
              </div>
            </div>

            {/* Balance Banner */}
            <div className="current-balance-banner rounded-4 p-3 mb-4 d-flex align-items-center gap-3">
              <div className="balance-icon">
                <i className="bi bi-wallet2"></i>
              </div>
              <div>
                <small className="opacity-75">Available Balance</small>
                <h5 className="mb-0 fw-bold">{formatCurrency(currentBalance)}</h5>
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
                      Withdrawal Amount
                    </label>
                    <div className="input-group input-group-lg">
                      <span className={`input-group-text fw-bold ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}>
                        ₹
                      </span>
                      <input
                        type="number"
                        className={`form-control ${exceedsBalance ? 'is-invalid' : ''} ${darkMode ? 'bg-dark-input border-secondary text-light' : ''}`}
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setAlert(null);
                        }}
                        min="1"
                        step="0.01"
                        max={currentBalance}
                        required
                      />
                    </div>
                    {exceedsBalance && (
                      <div className="invalid-feedback d-block mt-1 small">
                        Amount exceeds available balance of {formatCurrency(currentBalance)}.
                      </div>
                    )}
                  </div>

                  {/* Balance usage indicator */}
                  {parsed > 0 && !isNaN(parsed) && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className={darkMode ? 'text-light opacity-75' : 'text-muted'}>Using</span>
                        <span className={exceedsBalance ? 'text-danger fw-semibold' : 'fw-semibold'}>
                          {Math.min(100, percentUsed).toFixed(0)}% of balance
                        </span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div
                          className={`progress-bar ${exceedsBalance ? 'bg-danger' : 'bg-warning'}`}
                          style={{ width: `${Math.min(100, percentUsed)}%` }}
                        />
                      </div>
                    </div>
                  )}

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
                          disabled={q > currentBalance}
                          className={`btn btn-sm ${amount == q ? 'btn-warning' : darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                          onClick={() => setAmount(q)}
                        >
                          ₹{q.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-2 fw-semibold rounded-3"
                    disabled={submitting || exceedsBalance || currentBalance === 0}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-up-circle me-2"></i>
                        Withdraw {amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : 'Funds'}
                      </>
                    )}
                  </button>

                  {currentBalance === 0 && (
                    <p className="text-center text-danger small mt-2 mb-0">
                      Your balance is zero. Please make a deposit first.
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Info */}
            <div className={`card border-0 rounded-4 mt-3 ${darkMode ? 'dark-card' : 'bg-light'}`}>
              <div className="card-body p-3">
                <p className={`small mb-1 fw-semibold ${darkMode ? 'text-light' : ''}`}>
                  <i className="bi bi-info-circle me-1 text-warning"></i>Withdrawal Info
                </p>
                <ul className={`small mb-0 ps-3 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                  <li>Minimum withdrawal: ₹1</li>
                  <li>Maximum per transaction: ₹1,00,000</li>
                  <li>Cannot exceed available balance</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
