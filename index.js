const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

var admin = require("firebase-admin");

const firebaseConfig = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const app = express();
app.use(bodyParser.json());

app.post("/broadcast", (req, res) => {
  const message = req.body.notification;
  const topic = "posts";

  var messageToSend = {
    notification: {
      title: message.title,
      body: message.body,
    },
    topic: topic,
    android: {
      priority: "high",
    },
    webpush: {
      headers: {
        TTL: "86400", // 24 hours
      },
    },
  };

  admin
    .messaging()
    .send(messageToSend)
    .then((response) => {
      console.log("Notification sent successfully");
      res.status(200).send("Notification sent successfully");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error sending notification");
    });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
