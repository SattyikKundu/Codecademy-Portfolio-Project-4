/* 
 * redditAPIcalls.js — How API Calls Are Routed via Netlify Functions and netlify-cli
 *
 * This file contains helper functions that make client-side fetch requests to 
 * internal endpoints like '/api/subreddits' or '/api/subreddit?path=...'. 
 * 
 * These are not traditional API endpoints; instead, they're defined 
 * as *redirects* in `netlify.toml` file and powered by Netlify's serverless function system.
 *
 * Here's how this works in development and production:
 *
 * ➤ When using `netlify dev` (provided by the netlify-cli package), it starts up:
 *    - Your React app (usually on http://localhost:8888 when running via `netlify dev`)
 *    - A local server that maps `/api/*` routes to the serverless functions inside '/netlify/functions/' folder path
 *
 * ➤ The `netlify.toml` file contains [[redirects]] rules like:
 *      from = "/api/subreddits"
 *      to   = "/.netlify/functions/getSubReddits"
 *
 * ➤ These redirect rules ensure:
 *      - Any call to `/api/subreddits`            goes to `netlify/functions/getSubReddits.js`
 *      - Any call to `/api/subreddit?path=/r/...` goes to `netlify/functions/getSubReddit.js`
 *
 * ➤ netlify-cli makes this seamless during local development by:
 *      - Acting as a reverse proxy
 *      - Compiling your functions
 *      - Serving both frontend and backend as a unified local server
 *
 * Due to Reddit's stricter access rules, JSON data can no longer be fetched directly
 * from the frontend. Instead, this app uses serverless backend-like functions as
 * intermediaries to proxy Reddit API requests. This approach helps bypass CORS-related
 * restrictions while still allowing access to Reddit’s public data — all within the
 * context of a static frontend environment!
 * 
 */

const RedditAPIcalls = {

  async getSubReddits() {        // Calls backend to return JSON object containing all subreddits' information
    const response = await fetch('/api/subreddits'); // Calls redirected Netlify function
    const  subRedditsJSON = await response.json();    // Parses and returns JSON response
    return subRedditsJSON;             
  },

  getFullSubRedditUrl(paramUrl) { // Takes a subreddit path (e.g. '/r/Home/') and builds a Netlify-safe API URL

    // NOTE: paramUrl usually ends with a trailing slash ('/')
    //       This trailing slash is removed using slice(0, -1)
    //       so the resulting path fits correctly into the Reddit API URL structure.
    //       For example: '/r/Home/' → '/r/Home' → then appended as ?path=/r/Home

    // Construct and return query URL for backend
    const fullSubRedditUrl = `/api/subreddit?path=${paramUrl.slice(0, -1)}`; 
    return fullSubRedditUrl;
  },


  async getSubRedditPosts(subRedditUrl) {       // retuns JSON object of specific subreddit based on url param input
    const response = await fetch(subRedditUrl); // This URL should come from getFullSubRedditUrl()
    const  posts   = await response.json();     // Parses the JSON Reddit post list for subReddit
    return posts;
  },


  async getPostComments(permalink) {  // get all posts's comments via post's permalink

    // NOTE: 'permaLink.slice(0,-1)' excludes last 
    //          character('/') from permaLink so '.json' can be appended 
    const fullPostUrl = `https://www.reddit.com${permalink.slice(0, -1)}.json`; // Clean up permalink & build full Reddit API URL
    const response = await fetch(fullPostUrl);
    const post        = await response.json()
    return post[1]; // NOTE: This data contains BOTH the post(post[0]) and its comments(post[1]).
                    //       Since we only want the post's comments, we return 'post[1]'. 
  }

};

export default RedditAPIcalls;                          // Exports all above functions as a single object




