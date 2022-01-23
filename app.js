const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const port = 3000;

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port:3000");
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.use(express.static("public"));

app.post("/", function (req, res) {
  const userName = req.body.fName;
  const userSurname = req.body.lName;
  const userMail = req.body.email;

  console.log(`name: ${userName} lastname: ${userSurname} email: ${userMail}`);

  const data = {
    members: [
      {
        email_address: userMail,
        status: "subscribed",
        merge_fields: {
          FNAME: userName,
          LNAME: userSurname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/31148d26a2";

  const options = {
    method: "POST",
    auth: "rekal:4153b83ca6b61b7aceb0d3c4ee6d76ee-us20",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log("Status code: " + response.statusCode);
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});
