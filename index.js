require('dotenv').config();
const express = require('express');
const paypal = require('./config/paypal');
const routes = require('./routes/index');
const app = express();
const port = process.env.PORT || 8080

app.use(express.json());

// Connect to paypal
paypal.connect(process.env.CLIENT_ID,process.env.SECRET_PAYPAL_KEY)

routes(app);

app.listen(port, () => console.log(`Server is running on port ${port}`));