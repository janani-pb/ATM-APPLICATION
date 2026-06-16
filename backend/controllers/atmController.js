const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get current balance
// @route   GET /api/atm/balance
// @access  Private
const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'name email accountNumber balance lastLogin'
    );
    res.status(200).json({
      balance: user.balance,
      accountNumber: user.accountNumber,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error('Get Balance Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Deposit money
// @route   POST /api/atm/deposit
// @access  Private
const deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: 'Please enter a valid amount greater than 0.' });
    }

    if (parsedAmount > 1000000) {
      return res
        .status(400)
        .json({ message: 'Maximum deposit limit is ₹10,00,000 per transaction.' });
    }

    const user = await User.findById(req.user._id);
    user.balance = parseFloat((user.balance + parsedAmount).toFixed(2));
    await user.save({ validateBeforeSave: false });

    const transaction = await Transaction.create({
      userId: user._id,
      transactionType: 'deposit',
      amount: parsedAmount,
      balanceAfterTransaction: user.balance,
      description: 'Cash Deposit',
    });

    res.status(200).json({
      message: `₹${parsedAmount.toLocaleString('en-IN')} deposited successfully!`,
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error('Deposit Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Withdraw money
// @route   POST /api/atm/withdraw
// @access  Private
const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: 'Please enter a valid amount greater than 0.' });
    }

    const user = await User.findById(req.user._id);

    if (parsedAmount > user.balance) {
      return res.status(400).json({
        message: `Insufficient funds. Your available balance is ₹${user.balance.toLocaleString('en-IN')}.`,
      });
    }

    if (parsedAmount > 100000) {
      return res
        .status(400)
        .json({ message: 'Maximum withdrawal limit is ₹1,00,000 per transaction.' });
    }

    user.balance = parseFloat((user.balance - parsedAmount).toFixed(2));
    await user.save({ validateBeforeSave: false });

    const transaction = await Transaction.create({
      userId: user._id,
      transactionType: 'withdrawal',
      amount: parsedAmount,
      balanceAfterTransaction: user.balance,
      description: 'Cash Withdrawal',
    });

    res.status(200).json({
      message: `₹${parsedAmount.toLocaleString('en-IN')} withdrawn successfully!`,
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error('Withdraw Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Get transaction history
// @route   GET /api/atm/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total,
    });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Get user profile
// @route   GET /api/atm/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const transactionCount = await Transaction.countDocuments({
      userId: req.user._id,
    });

    res.status(200).json({ user, transactionCount });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { getBalance, deposit, withdraw, getHistory, getProfile };
