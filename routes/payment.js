const express = require("express");
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/order', PaymentController.Order);
router.get('/success', PaymentController.PaymentSuccess);
router.get('/cancel', PaymentController.CancelPayment);

module.exports = router;