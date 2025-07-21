const axios = require('axios');   // Import Axios library to make HTTP requests

const handler = async (event, context) => {  // Define the Netlify serverless function handler
  try {
    const response = await axios.get(         // Make a GET request to Reddit's subreddits endpoint
      'https://www.reddit.com/subreddits.json' // URL to get list of popular subReddits
      // 'https://www.reddit.com/subreddits.json?limit=10' // Comment out above if you want to limit subReddits on left menu
    );

    // Add this for debugging
    console.log("🔥 RAW Reddit API Response:", JSON.stringify(response.data, null, 2));
    const data = response.data;
    if (!data?.data?.children || !Array.isArray(data.data.children)) {
      console.warn("⚠️ Unexpected Reddit API structure(1)", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected Reddit API structure(1)' }),
      };
    }

    return {                                
      statusCode: 200,                     // If successful, return json object with HTTP 200 OK
      body: JSON.stringify(response.data), // Convert the Reddit API response to JSON string and return
    };
  } 
  catch (error) {  // If there's an error, return json response with HTTP 500 Internal Server Error
    return {
      statusCode: 500,         
      body: JSON.stringify({    // Include error message in the response body
        error: 'Failed to fetch subReddits',
        details: error.message,
      }),
    };
  }
};

module.exports = { handler }; // Export the handler function so Netlify can use it
