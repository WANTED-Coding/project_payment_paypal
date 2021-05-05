const paymentRouter = require('./payment');

function routes(app) {
  app.use("/payment", paymentRouter);
}
module.exports = routes;