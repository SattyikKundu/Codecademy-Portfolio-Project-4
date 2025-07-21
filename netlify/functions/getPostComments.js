const axios = require('axios'); // Import Axios to make HTTP requests

const handler = async (event) => { // Define the serverless function handler

  const { permalink } = event.queryStringParameters; // Extract 'permalink' query string parameter from incoming request

  if (!permalink) { // If 'permalink' is missing, return a 400 Bad Request response
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing permalink parameter' }),
    };
  }

  try {  // Remove trailing slash from permalink if present, so '.json' appends cleanly
    const cleanedPermalink = permalink.endsWith('/') ? permalink.slice(0, -1): permalink;

    const redditUrl = `https://www.reddit.com${cleanedPermalink}.json`; // Full Reddit API URL for post comments

    const response = await axios.get(redditUrl); // Make GET request to Reddit API to fetch post and its comments

    return {  // Return only comments section (second item in response data array)
      statusCode: 200,
      body: JSON.stringify(response.data[1]),
    };

  } 
  catch (error) { // If an error occurs during the request, return a 500 Internal Server Error
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch comments',
        details: error.message,
      }),
    };
  }
};

module.exports = { handler }; // Export the handler so Netlify can execute it as a function
