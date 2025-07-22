/*
const axios = require('axios');  // Import Axios to perform HTTP requests

const handler = async (event) => {  // Define the Netlify serverless function handler

  console.log("✅ getSubReddit function triggered");

  const { path } = event.queryStringParameters; // Extract the `path` query param from the request (e.g., /r/gaming)
  console.log("📥 Received path:", path);

  // ✅ Clean up the path (remove trailing slash if it exists)
  const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;

  // ✅ Build the final Reddit URL using the cleaned path
  const redditUrl = `https://www.reddit.com${cleanPath}.json?raw_json=1`;
  console.log("📡 Final Reddit URL:", redditUrl);


  if (!path) {  // If no path is provided, return 400 Bad Request json response
    console.log("⚠️ No subreddit path provided.");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing subReddit path.' }),
    };
  }

  try {
    const response = await axios.get(                 // Request JSON data for the given subreddit path
      //`https://www.reddit.com${path}.json?raw_json=1`, // `raw_json=1` only 'raw' json data is obtained 
                                                      // (need to get accurate media data from json data!)
      //{ headers: {'User-Agent': 'RedditMinimalApp/1.0 (+https://mini-reddit-clone.netlify.app)'}}
      redditUrl,
      { headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedditMinimalApp/1.0; +https://mini-reddit-clone.netlify.app)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      }}
    );

    // 🔍 Debug log of full response
    //console.log("🔥 RAW Reddit API Response:", JSON.stringify(response.data, null, 2));

    const data = response.data;


    /*if (!Array.isArray(data) || data.length < 2){  // 🔒 Basic structure validation
      console.log("⚠️ Unexpected Reddit API structure (not an array or too short)(2):", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected Reddit API structure (not array or too short) (2)' }),
      };
    }//

    /*
    if (!data?.data?.children || !Array.isArray(data.data.children)) {
      console.log("⚠️ Reddit response missing expected children array (posts list)", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected Reddit API structure (missing post list)' }),
      };
    }//

    if (!data || !data.data || !Array.isArray(data.data.children)) {
      console.log("⚠️ Invalid Reddit structure. Logging response:", JSON.stringify(data).slice(0, 500));
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid or missing post data from Reddit.' }),
      };
    }


    /*
    if (!data[1]?.data?.children){  // Optional deeper check on post + comments
      console.log("⚠️ Reddit response missing expected comments data at [1].data.children (2)", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected Reddit API structure (missing children array) (2)' }),
      };
    }//


    return {
      statusCode: 200,                      // If successful, return HTTP 200
      body: JSON.stringify(response.data),  // Return Reddit's response as JSON
    };
  } 
  catch (error) {  // On error, return HTTP 500 json response with error message
    console.error("❌ Failed to fetch subreddit:", error.message);
    return {
      statusCode: 500,              
      body: JSON.stringify({ 
        error: 'Failed to fetch subreddit', 
        details: error.message 
      }),
    };
  }
};

module.exports = { handler };  // Export handler for Netlify to use
*/

const axios = require("axios");
const { getRedditAccessToken } = require("./utils/redditAuthHelper");

const handler = async (event) => {
  const { permalink } = event.queryStringParameters;

  if (!permalink) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing permalink parameter" }),
    };
  }

  try {
    const token = await getRedditAccessToken();
    const cleanedPermalink = permalink.endsWith("/") ? permalink.slice(0, -1) : permalink;

    const response = await axios.get(
      `https://oauth.reddit.com${cleanedPermalink}.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": `web:mini-reddit-clone.netlify.app:v1.0 (by /u/${process.env.REDDIT_USERNAME})`,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data[1]), // Only return comments
    };
  } catch (error) {
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
