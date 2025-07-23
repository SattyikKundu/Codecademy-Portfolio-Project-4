const { getRedditAccessToken } = require("./utils/redditAuthHelper"); // import token method
const axios = require("axios");                                       // import 'axios' for fetching


const handler = async (event) => {
  const {path} = event.queryStringParameters; // extract parameter from url 
                                              // (Example: extract "/r/Home" from "/api/subreddit?path=/r/Home")

  if(!path) { // Handle If there's no subReddit permalink from 'path' param
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing permalink parameter" }),
    };
  }

  try {
    const token = await getRedditAccessToken(); // retrieve access OAuth access token from Reddit
    const cleanedPermalink = path.endsWith("/") ? path.slice(0, -1) : path; // remove trailing '/' from permalink

    const response = await axios.get(
      `https://oauth.reddit.com${cleanedPermalink}.json?raw_json=1`, // 
      {
        headers: { // authorization token AND 'User-Agent' needed to get successful request from reddit API 
                   // (even on a 'production' environment like Netlify)
          Authorization: `Bearer ${token}`,
          "User-Agent": `web:${process.env.HOSTING_URI}:v1.0 (by /u/${process.env.REDDIT_USERNAME})`,
        },
      }
    );

    return { // If success, return nested 'children' array which contains post objects.
             // This array of post objects is used in postsSlice.js
      statusCode: 200,
      body: JSON.stringify(response.data.data.children) 
    };
  } 
  catch (error) { // If failure, return error message
    console.error("❌ Failed to fetch comments:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch comments",
        details: error.message,
      }),
    };
  }
};

module.exports = { handler };