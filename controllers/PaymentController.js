const e = require("express");
const paypal = require("paypal-rest-sdk");

class PaymentController {
  async Order(req, res, next) {
    const { price } = req.body;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http:///localhost:3000/payment/success?price=${price}`,
        cancel_url: "http://localhost:3000/payment/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Phí vận chuyển",
                sku: "001",
                price: `${price}`,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: `${price}`,
          },
          description: "Phí vận chuyển SuperHub",
        },
      ],
    };
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.log(error);
        res.status(400).send({
          data: "",
          error: "Cannot create order!",
        });
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.status(200).send({
              data: payment.links[i].href,
              error: "Cannot create order!",
            });
          }
        }
      }
    });
  }

  async PaymentSuccess(req, res, next) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const price = req.query.price;
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: `${price}`,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          res.status(400).send("Payment Fail");
        } else {
          res.status(200).send(payment);
        }
      }
    );
  }

  async CancelPayment(req, res, next) {
    res.status(400).send("Payment is canceled");
  }

  async RefundPayment(req, res, next) {
    const {idPayment, transaction} = req.body;
    const data = {
      amount: {
        total: `${transaction}`,
        currency: 'USD'
      }
    };

    paypal.sale.refund(idPayment, data, function (error, refund){
      if (error){
        res.status(200).send({
          msg: 'Refund fail!',
          data: '',
          error: error,
        });
      } else {
        res.status(200).send({
          msg: 'Refund success!',
          data: refund,
          error: '',
        });
      }
    });
  }
}

module.exports = new PaymentController();
