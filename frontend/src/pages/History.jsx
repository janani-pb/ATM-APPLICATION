import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { atmAPI } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const History = ({ darkMode }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await atmAPI.getHistory(page, 10);
        setTransactions(data.transactions || []);
        setTotalPages(data.totalPages);
        setTotal(data.totalTransactions);
      } catch {
        setAlert({ type: 'danger', message: 'Failed to load transaction history.' });
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.transactionType === filter);

  const deposits = transactions.filter((t) => t.transactionType === 'deposit');
  const withdrawals = transactions.filter((t) => t.transactionType === 'withdrawal');
  const totalDeposited = deposits.reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = withdrawals.reduce((s, t) => s + t.amount, 0);

  return (
    <div className={`min-vh-100 py-4 ${darkMode ? 'dark-bg' : 'page-bg'}`}>
      <div className="container">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link to="/dashboard" className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div>
            <h4 className={`mb-0 fw-bold ${darkMode ? 'text-light' : ''}`}>Transaction History</h4>
            <small className={darkMode ? 'text-light opacity-75' : 'text-muted'}>
              {total} total transactions
            </small>
          </div>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className={`card border-0 rounded-4 text-center p-3 ${darkMode ? 'dark-card' : 'bg-white'} shadow-sm`}>
              <p className={`small mb-1 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Total Transactions</p>
              <h5 className={`mb-0 fw-bold ${darkMode ? 'text-light' : ''}`}>{total}</h5>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={`card border-0 rounded-4 text-center p-3 ${darkMode ? 'dark-card' : 'bg-white'} shadow-sm`}>
              <p className={`small mb-1 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Total Deposited</p>
              <h5 className="mb-0 fw-bold text-success">{formatCurrency(totalDeposited)}</h5>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={`card border-0 rounded-4 text-center p-3 ${darkMode ? 'dark-card' : 'bg-white'} shadow-sm`}>
              <p className={`small mb-1 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Total Withdrawn</p>
              <h5 className="mb-0 fw-bold text-danger">{formatCurrency(totalWithdrawn)}</h5>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={`card border-0 rounded-4 text-center p-3 ${darkMode ? 'dark-card' : 'bg-white'} shadow-sm`}>
              <p className={`small mb-1 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Net Flow</p>
              <h5 className={`mb-0 fw-bold ${(totalDeposited - totalWithdrawn) >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(totalDeposited - totalWithdrawn)}
              </h5>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-3">
          <div className={`btn-group ${darkMode ? '' : ''}`}>
            {['all', 'deposit', 'withdrawal'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`card border-0 rounded-4 shadow-sm ${darkMode ? 'dark-card' : ''}`}>
          <div className="card-body p-0">
            {loading ? (
              <div className="p-5">
                <Spinner text="Loading transactions..." />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <i className={`bi bi-inbox fs-1 ${darkMode ? 'text-light opacity-50' : 'text-muted'}`}></i>
                <p className={`mt-2 mb-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>
                  {filter === 'all' ? 'No transactions yet.' : `No ${filter}s found.`}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className={`table align-middle mb-0 ${darkMode ? 'table-dark' : 'table-hover'}`}>
                  <thead>
                    <tr className={darkMode ? '' : 'table-light'}>
                      <th className="px-4 py-3 fw-semibold">Type</th>
                      <th className="py-3 fw-semibold">Amount</th>
                      <th className="py-3 fw-semibold d-none d-md-table-cell">Balance After</th>
                      <th className="py-3 fw-semibold d-none d-sm-table-cell">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tx) => (
                      <tr key={tx._id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className={`tx-icon-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 ${
                              tx.transactionType === 'deposit' ? 'tx-icon-deposit' : 'tx-icon-withdraw'
                            }`}>
                              <i className={`bi ${tx.transactionType === 'deposit' ? 'bi-arrow-down' : 'bi-arrow-up'} small`}></i>
                            </div>
                            <span className="fw-semibold text-capitalize">{tx.transactionType}</span>
                          </div>
                        </td>
                        <td className={`py-3 fw-bold ${tx.transactionType === 'deposit' ? 'text-success' : 'text-danger'}`}>
                          {tx.transactionType === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="py-3 d-none d-md-table-cell">
                          {formatCurrency(tx.balanceAfterTransaction)}
                        </td>
                        <td className={`py-3 small d-none d-sm-table-cell ${darkMode ? '' : 'text-muted'}`}>
                          {formatDate(tx.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-3 d-flex justify-content-center">
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}

      </div>
    </div>
  );
};

export default History;
