const express = require('express');
const router = express.Router();
const {
  getBalance,
  deposit,
  withdraw,
  getHistory,
  getProfile,
} = require('../controllers/atmController');
const { protect } = require('../middleware/authMiddleware');

// All ATM routes are protected
router.use(protect);

router.get('/balance', getBalance);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.get('/history', getHistory);
router.get('/profile', getProfile);

module.exports = router;
