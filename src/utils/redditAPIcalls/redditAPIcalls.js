

// urls for accessing Reddit and subreddit json data
const homeUrl    = 'https://www.reddit.com';
const subReddits = 'https://www.reddit.com/reddits.json';

const RedditAPIcalls = { // nest API calling functions into one exportable object

    async getSubReddits() { // returns JSON object containing all subreddits' information
        const  response   = await fetch(subReddits);
        //const  subReddits = await response.json(); // <== 'subReddits' being same cause issues!
        const  subRedditsJSON = await response.json(); 
        return subRedditsJSON;
    },

    getSubRedditUrl(paramUrl) { // (ex:'/r/Home/') creates full url for selected subreddit

        console.log('paramUrl: ',paramUrl);

        /* NOTE: 'paramUrl.subString(0,(paramUrl.length-1))' excludes last 
                  character('/') from paramUrl so '.json' can be appended */
        const subRedditUrl = `${homeUrl}${paramUrl.substring(0,(paramUrl.length-1))}.json`;
        //const subRedditUrl = homeUrl + paramUrl.substring(0,(paramUrl.length-1)) + '.json';
        return subRedditUrl;
    },

    async getSubRedditPosts(subRedditUrl) { // retuns JSON object of specific subreddit based on param input
        const  response  = await fetch(subRedditUrl);
        const  posts     = await response.json();
        return posts; 
    },

    async getPostComments(permaLink) { // get all posts's comments via post's permalink

        /* NOTE: 'permaLink.slice(0,-1)' excludes last 
                  character('/') from permaLink so '.json' can be appended */
        const fullPostUrl = `${homeUrl}${permaLink.slice(0,-1)}.json`;
        //const  fullPostUrl = homeUrl + permaLink.slice(0,-1) + '.json';
        const response    = await fetch(fullPostUrl);
        const post        = await response.json()

        return post[1]; /* NOTE: This data contains BOTH the post(post[0]) and its comments(post[1]).
                                 Since we only want the post's comments, we return 'post[1]'. */
    }
};

export default RedditAPIcalls; // exports functions as one object
