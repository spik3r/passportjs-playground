const express = require("express");
const router = express.Router();
const axios = require("axios");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthaSJ9.dl7Jw1kZV2oNJt8vKJ53iWW-OwXSV23f7LRueOtZAtI";
const config = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthaSJ9.DfjEVEOVY60MSRX7h1iBKnc83T5ASzoD2ZsI3RjfpIo`
  }
};

const getSecret = () => {
  console.log("getSecret called");
  return axios
    .get("http://localhost:3000/api/getToken")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
};

const getSecretWithAuth = () => {
  console.log("getSecretWithAuth called");
  return axios
    .get("http://localhost:3000/api/", config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
};

// the unauthenticated one
router.get("/", (req, res) => {
  console.log("/user called");
  getSecret()
    .then(data => {
      res.json({ message: "Request received!", data });
    })
    .catch(error => {
      console.log(error);
    });
});

// with bearer token
router.get("/auth", (req, res) => {
  console.log("/user/auth called");
  getSecretWithAuth()
    .then(data => {
      res.json({ message: "Request received!", data });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
