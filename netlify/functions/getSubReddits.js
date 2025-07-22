const { getRedditAccessToken } = require("./utils/redditAuthHelper"); // get access token method
const axios = require("axios");                                       // import axios for fetching

const handler = async (event, context) => {

  try {
    const token = await getRedditAccessToken(); // get access token

    const response = await axios.get(
      "https://oauth.reddit.com/subreddits/popular", // URL route for JSON data with popular subReddits
      {
        headers: { // Authorization token AND 'user-agent' to enable successful access to Reddit API
          Authorization: `Bearer ${token}`,
          "User-Agent": `web:mini-reddit-clone.netlify.app:v1.0 (by /u/${process.env.REDDIT_USERNAME})`,
        },
      }
    );

    return { // On success, return json data with list of popular subReddits for left-side subReddits menu
      statusCode: 200,
      body: JSON.stringify(response.data),
    };

  } 
  catch (error) { // On failure, return json object with error message
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Reddit API fetch failed",
        details: error.message,
      }),
    };
  }
};

module.exports = { handler };