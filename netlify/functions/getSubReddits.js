const axios = require('axios');   // Import Axios library to make HTTP requests

const handler = async (event, context) => {  // Define the Netlify serverless function handler

  console.log("✅ getSubReddits function triggered"); // Top level

  try {
    const response = await axios.get(         // Make a GET request to Reddit's subreddits endpoint
      'https://www.reddit.com/subreddits.json', // URL to get list of popular subReddits
      // 'https://www.reddit.com/subreddits.json?limit=10' // Comment out above if you want to limit subReddits on left menu
      {
        headers: { 
          'User-Agent': 'web:redditclone.liveappdemo.com:v1.0 (by /u/Anonymous-SK)',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
      //{headers: { 'User-Agent': 'RedditMinimalApp/1.0 (+https://mini-reddit-clone.netlify.app)' }}
      // {headers: {
      //   'User-Agent': 'Mozilla/5.0 (compatible; RedditMinimalApp/1.0; +https://mini-reddit-clone.netlify.app)',
      //   'Accept': 'application/json',
      //   'Accept-Language': 'en-US,en;q=0.9'
      // }}
    );

    // Add this for debugging
    // console.log("🔥 RAW Reddit API Response:", JSON.stringify(response.data, null, 2));
    // const data = response.data;
    // if (!data?.data?.children || !Array.isArray(data.data.children)) {
    //   console.log("⚠️ Unexpected Reddit API structure(1)", data);
    //   return {
    //     statusCode: 500,
    //     body: JSON.stringify({ error: 'Unexpected Reddit API structure(1)' }),
    //   };
    // }

    return {                                
      statusCode: 200,                     // If successful, return json object with HTTP 200 OK
      body: JSON.stringify(response.data), // Convert the Reddit API response to JSON string and return
    };
  } 
  catch (error) {  // If there's an error, return json response with HTTP 500 Internal Server Error
    console.error("❌ Failed to fetch subreddits:", error.message);
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
