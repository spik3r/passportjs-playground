const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 20 });

// this works
// axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthaSJ9.DfjEVEOVY60MSRX7h1iBKnc83T5ASzoD2ZsI3RjfpIo'; // for all requests



const getTokenFromCache = async () => {
  const token = cache.get('token');
  if (token) {
    console.log('Valid token found in cache.');
    return token;
  } else {
    console.log('No valid token found in cache');
    const newToken = await getToken();
    cache.set('token', newToken);
    return newToken;
  }
};

// still trying to get this to work
const setToken = async () => {
  const authToken = await getTokenFromCache();
  axios.defaults.headers.common['Authorization'] = authToken;
};

setToken();

// const config = {
//   headers: {
//     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthaSJ9.DfjEVEOVY60MSRX7h1iBKnc83T5ASzoD2ZsI3RjfpIo`
//   }
// };

//outgoing request

router.get("/addBearerToken", (req, res) => {
  console.log("/addBearerToken called");
  addBearerToken()
  res.json({ message: "addBearerToken"});

});


const getInfo = async () => {
  const config = await getConfig();
  const secret = await callSecureEndpoint(config);
  return 'all done: ' + secret;
}

const callSecureEndpoint = async (config) => {
    console.log("3. axios");
    return axios
      .get("http://localhost:3000/api/", config)
      .then(function await (response) {
        return response.data;
      })

      .catch(error => {
        console.log(error);
      });
};

router.get("/", async (req, res) => {
  console.log("/magic called");

  // const configg = getConfig();

  // console.log("_____ config");
  // console.log(configg);
  // console.log("_____ config");
  //
  //   return axios
  //     .get("http://localhost:3000/api/", configg)
  //     .then(response => {
  //       return response.data;
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });

  // Below call was working (not unauthorized) except the data not shown
 /* console.log("____end:");
  const data = await doRequest();
  console.log("____end____: " + data);
  res.json({ message: "The secret data is: ", data });*/

    return res.send(getInfo());
});


const doRequest = async () => {
  console.log("1. doRequest____");
  await getToken()
    .then(function (response) {
      console.log("2. The token:    "+ `Bearer ${response.data.bearer}`);
      return {
        headers: {
          Authorization: `Bearer ${response.data.bearer}`
        }
      };
    })
    .then(function (config) {
      console.log("3. axios");
      return axios
        .get("http://localhost:3000/api/", config)
        .then(function await (response) {
          return response.data;
        })

        .catch(error => {
          console.log(error);
        });
    });
  console.log("5. ____doRequest")
};


const getConfig = async () => {
  console.log("____");
  getToken()
    .then(function (response) {
      console.log("The token:    "+ `Bearer ${response.data.bearer}`);
      // return
      {
        headers: {
          Authorization: `Bearer ${response.data.bearer}`
        }
      };
    });
  console.log("____")

};

const addBearerToken = () => {
  getToken()
    .then(function (response) {
      console.log("The token:    "+ `Bearer ${response.data.bearer}`);
      return `Bearer ${response.data.bearer}`; // now the data is accessable from here.
    });
};
//-----
function getToken() {
  return axios.get("http://localhost:3000/api/getToken");
}

const getSecretWithAuth = () => {
  console.log("getSecretWithAuth called");
  return axios
    .get("http://localhost:3000/api/")
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
};


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
