const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

var express = require("express");
var cors = require("cors");
var request = require("request");
const crypto = require("crypto");

// const key = "rzp_test_i1CjVUmtGPDAk2";
// const key_secret = "Yc8izn6GmockEiHPF3C6iZI7";
const key = "rzp_live_ZPSwzvOlwjcbZC";
const key_secret = "GHQlOgktfPRGhECMT1tqx8dC";


var app = express();

app.use(cors({ origin: true }));

app.post("/", (req, res) => {
  const amount = req.body.amount;

  //Allow Api Calls from local server
  const allowedOrigins = [
    "http://localhost:8100",
    "https://directly-whatsapp.firebaseapp.com",
    "https://directly-whatsapp.web.app"
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  var options = {
    method: "POST",
    url: "https://api.razorpay.com/v1/orders",
    headers: {
      //There should be space after Basic else you get a BAD REQUEST error
      Authorization:
        "Basic " + new Buffer(key + ":" + key_secret).toString("base64")
    },
    form: {
      amount: amount,
      currency: "INR",
      receipt: "Yc8izn6GmockEiHPF3C6iZI7123" + Math.ceil(Math.random() * 1000000),
      payment_capture: 1
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });
});

app.post("/confirmPayment", (req, res) => {
  const order = req.body;
  const text = order.razorpay_order_id + "|" + order.razorpay_payment_id;
  var signature = crypto
    .createHmac("sha256", key_secret)
    .update(text)
    .digest("hex");

  if (signature === order.razorpay_signature) {
    console.log("PAYMENT SUCCESSFULL");

    res.send({ status: "PAYMENT SUCCESSFULL" });
  } else {
    res.send({ status: "Something went wrong!" });
    res.end();
  }
});

exports.paymentApi = functions.https.onRequest(app);
