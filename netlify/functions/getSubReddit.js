const axios = require('axios');  // Import Axios to perform HTTP requests

const handler = async (event) => {  // Define the Netlify serverless function handler

  console.log("✅ getSubReddit function triggered");

  const { path } = event.queryStringParameters; // Extract the `path` query param from the request (e.g., /r/gaming)

  if (!path) {  // If no path is provided, return 400 Bad Request json response
    console.log("⚠️ No subreddit path provided.");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing subReddit path.' }),
    };
  }

  try {
    const response = await axios.get(                 // Request JSON data for the given subreddit path
      `https://www.reddit.com${path}.json?raw_json=1` // `raw_json=1` only 'raw' json data is obtained 
                                                      // (need to get accurate media data from json data!)
    );

    // 🔍 Debug log of full response
    console.log("🔥 RAW Reddit API Response:", JSON.stringify(response.data, null, 2));

    const data = response.data;


    if (!Array.isArray(data) || data.length < 2){  // 🔒 Basic structure validation
      console.log("⚠️ Unexpected Reddit API structure (not an array or too short)(2):", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected Reddit API structure (not array or too short) (2)' }),
      };
    }
    if (!data[1]?.data?.children){  // Optional deeper check on post + comments
      console.log("⚠️ Reddit response missing expected comments data at [1].data.children (2)", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected Reddit API structure (missing children array) (2)' }),
      };
    }


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
