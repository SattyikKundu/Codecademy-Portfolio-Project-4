// netlify/functions/debugRedditRequest.js
const axios = require('axios');

const handler = async () => {
  console.log("🔍 Running Reddit debug test...");

  const url = 'https://www.reddit.com/r/javascript.json?raw_json=1';

  const headersList = [
    {
      name: 'Browser-like headers',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RedditMinimalApp/1.0',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    },
    {
      name: 'Minimal custom User-Agent',
      headers: {
        'User-Agent': 'RedditMinimalApp/1.0 (+https://mini-reddit-clone.netlify.app)'
      },
    },
    {
      name: 'No headers',
      headers: {},
    }
  ];

  for (let config of headersList) {
    try {
      console.log(`🌐 Trying: ${config.name}`);
      const response = await axios.get(url, {
        headers: config.headers,
      });

      console.log(`✅ Success: ${config.name}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: config.name,
          status: response.status,
          sampleTitle: response.data?.data?.children?.[0]?.data?.title || 'no title',
        }),
      };
    } catch (err) {
      console.log(`❌ Failed: ${config.name} → ${err.message}`);
    }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: "All header configurations failed." }),
  };
};

module.exports = { handler };
