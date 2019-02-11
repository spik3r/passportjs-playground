const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 20 });

const config = {
  header: {
    Authorization: `Basic header-goes-here`
  }
};

const getToken = async (authServerUrl, tokenName) => {

  const response = await axios.get(authServerUrl, config);
  return response.data[tokenName];
};


const createConfig = async (token) => {
    console.log("2. The token:    "+ `Bearer ${token}`);
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
};

const makeCall = async (config) => {
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

const getTokenFromCache = async () => {
  const token = cache.get('token');

  if (token) {
    console.log('Valid token found in cache: ' + token);
    return token;
  } else {
    console.log('No valid token found in cache. Getting new Token from auth service.');

    const newToken = await getToken('http://localhost:3000/api/getToken', 'bearer');
    console.log(newToken);
    cache.set('token', newToken);
    return newToken;
  }
};

const doRequest = async (res) => {
  console.log("1. doRequest____");
  // const token = await getToken();
  const token = await getTokenFromCache('token');
  const config = await createConfig(token);
  const result = await makeCall(config);
  res.json({ message: "Request received!", result });
  console.log("5. ____doRequest")
};

// with bearer token
router.get("/", async  (req, res) => {
  console.log("/foo called");
  doRequest(res);
});

module.exports = router;
