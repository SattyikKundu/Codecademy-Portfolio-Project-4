

// urls for accessing Reddit and subreddit json data
const homeUrl    = 'https://www.reddit.com/';
const subReddits = 'https://www.reddit.com/reddits.json';

const RedditAPIcalls = { // nest API calling functions into one exportable object

    async getSubReddits() { // returns JSON object containing all subreddits' information
        const response = await fetch(subReddits);
        const data     = await response.json(); 
        return data;
    },

    async getSubRedditPosts(paramUrl) { // retuns JSON object of specific subreddit based on param input
        const subRedditUrl = homeUrl + paramUrl;
        const response     = await fetch(subRedditUrl);
        const data         = await response.json();
        return data;
    }
};

export default RedditAPIcalls; // exports functions as one object
