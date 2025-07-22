const axios = require("axios"); // used for axios methods

let cachedToken = null; // create token holder variables
let tokenExpiry = null;

//async function getRedditAccessToken() {
const getRedditAccessToken = async () => {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken; // return cached token if still valid
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  const response = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        "User-Agent": `web:mini-reddit-clone.netlify.app:v1.0 (by /u/${process.env.REDDIT_USERNAME})`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000 - 3000; // Refresh a bit early
  return cachedToken;
}

module.exports = { getRedditAccessToken };
