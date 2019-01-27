const express = require("express");
const router = express.Router();
const passport = require("passport");

const jwt = require("jwt-simple");
const BearerStrategy = require("passport-http-bearer").Strategy;

const SECRET = "mysecret";
// token: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthaSJ9.dl7Jw1kZV2oNJt8vKJ53iWW-OwXSV23f7LRueOtZAtI
passport.use(
  new BearerStrategy((token, done) => {
    console.log("token: " + token);
    try {
      const { username } = jwt.decode(token, SECRET);
      console.log("username: " + username);

      if (username === "Kai") {
        done(null, username);
        console.log("success ");
        return;
      }
      console.log("failure ");
      done(null, false);
    } catch (error) {
      console.log("error " + error);
      done(null, false);
    }
  })
);

router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    console.table(req);
    res.json({ SecretData: "superSecret info abc123 = $$$ to the moon" });
  }
);

router.get("/getToken", (req, res) => {
  res.json({
    theToken: "isHere",
    bearer:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthaSJ9.DfjEVEOVY60MSRX7h1iBKnc83T5ASzoD2ZsI3RjfpIo"
  });
});

module.exports = router;
