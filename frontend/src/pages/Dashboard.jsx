import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { atmAPI } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const Dashboard = ({ darkMode }) => {
  const { user, updateUserBalance } = useAuth();
  const [balance, setBalance] = useState(user?.balance ?? 0);
  const [lastLogin, setLastLogin] = useState(user?.lastLogin || null);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balRes, histRes] = await Promise.all([
          atmAPI.getBalance(),
          atmAPI.getHistory(1, 5),
        ]);
        setBalance(balRes.data.balance);
        setLastLogin(balRes.data.lastLogin);
        updateUserBalance(balRes.data.balance);
        setRecentTx(histRes.data.transactions || []);
      } catch {
        setAlert({ type: 'danger', message: 'Failed to load account data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const cards = [
    {
      to: '/deposit',
      icon: 'bi-arrow-down-circle-fill',
      label: 'Deposit',
      desc: 'Add money to your account',
      color: 'success',
      bg: darkMode ? '#1a3a2a' : '#d1fae5',
    },
    {
      to: '/withdraw',
      icon: 'bi-arrow-up-circle-fill',
      label: 'Withdraw',
      desc: 'Take out cash from balance',
      color: 'warning',
      bg: darkMode ? '#3a2a00' : '#fef3c7',
    },
    {
      to: '/history',
      icon: 'bi-clock-history',
      label: 'History',
      desc: 'View all transactions',
      color: 'info',
      bg: darkMode ? '#0a2a3a' : '#dbeafe',
    },
    {
      to: '/profile',
      icon: 'bi-person-badge-fill',
      label: 'Profile',
      desc: 'Manage your account',
      color: 'primary',
      bg: darkMode ? '#1a1a3a' : '#ede9fe',
    },
  ];

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className={`min-vh-100 py-4 ${darkMode ? 'dark-bg' : 'page-bg'}`}>
      <div className="container">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Welcome header */}
        <div className="row mb-4">
          <div className="col">
            <h4 className={`fw-bold mb-1 ${darkMode ? 'text-light' : ''}`}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h4>
            {lastLogin && (
              <p className={`mb-0 small ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                <i className="bi bi-clock me-1"></i>
                Last login: {formatDate(lastLogin)}
              </p>
            )}
          </div>
        </div>

        {/* Balance Card */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="balance-card card border-0 text-white rounded-4 p-4 shadow-lg position-relative overflow-hidden">
              <div className="balance-pattern"></div>
              <div className="row align-items-center position-relative">
                <div className="col-md-8">
                  <p className="mb-1 opacity-75 small text-uppercase letter-spacing">Available Balance</p>
                  <h2 className="display-5 fw-bold mb-2">
                    {formatCurrency(balance)}
                  </h2>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span className="badge bg-white bg-opacity-25 px-3 py-2 rounded-pill">
                      <i className="bi bi-credit-card me-1"></i>
                      {user?.accountNumber}
                    </span>
                    <span className="badge bg-white bg-opacity-25 px-3 py-2 rounded-pill">
                      <i className="bi bi-shield-check me-1"></i>
                      Active
                    </span>
                  </div>
                </div>
                <div className="col-md-4 text-end d-none d-md-block">
                  <i className="bi bi-bank2 opacity-25" style={{ fontSize: '6rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="row g-3 mb-4">
          {cards.map((card) => (
            <div key={card.to} className="col-6 col-md-3">
              <Link
                to={card.to}
                className="text-decoration-none"
              >
                <div
                  className={`card border-0 h-100 rounded-4 p-3 action-card ${darkMode ? 'dark-card' : ''}`}
                  style={{ backgroundColor: card.bg }}
                >
                  <div className="card-body p-0 text-center">
                    <i className={`bi ${card.icon} text-${card.color} mb-2`} style={{ fontSize: '2rem' }}></i>
                    <h6 className={`fw-bold mb-1 ${darkMode ? 'text-light' : ''}`}>{card.label}</h6>
                    <p className={`small mb-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className={`card border-0 rounded-4 shadow-sm ${darkMode ? 'dark-card' : ''}`}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className={`fw-bold mb-0 ${darkMode ? 'text-light' : ''}`}>
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Recent Activity
              </h6>
              <Link to="/history" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>

            {recentTx.length === 0 ? (
              <div className="text-center py-4">
                <i className={`bi bi-inbox fs-1 ${darkMode ? 'text-light opacity-50' : 'text-muted'}`}></i>
                <p className={`mt-2 mb-0 small ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                  No transactions yet. Make your first deposit!
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {recentTx.map((tx) => (
                  <div
                    key={tx._id}
                    className={`list-group-item border-0 px-0 d-flex align-items-center gap-3 ${darkMode ? 'bg-transparent text-light' : ''}`}
                  >
                    <div className={`tx-icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                      tx.transactionType === 'deposit' ? 'tx-icon-deposit' : 'tx-icon-withdraw'
                    }`}>
                      <i className={`bi ${tx.transactionType === 'deposit' ? 'bi-arrow-down' : 'bi-arrow-up'}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className={`mb-0 fw-semibold text-capitalize ${darkMode ? 'text-light' : ''}`}>
                        {tx.transactionType}
                      </p>
                      <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                        {formatDate(tx.createdAt)}
                      </small>
                    </div>
                    <div className="text-end">
                      <p className={`mb-0 fw-bold ${tx.transactionType === 'deposit' ? 'text-success' : 'text-danger'}`}>
                        {tx.transactionType === 'deposit' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </p>
                      <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
                        Bal: {formatCurrency(tx.balanceAfterTransaction)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
