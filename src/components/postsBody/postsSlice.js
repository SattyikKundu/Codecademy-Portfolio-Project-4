import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RedditAPIcalls from '../../utils/redditAPIcalls/redditAPIcalls.js';


/***************************************************************************************************************/
/***************************************************************************************************************/
/***************** Below asycn thunk function returns all posts within provided Sub-Reddit url *****************/
/***************************************************************************************************************/
/***************************************************************************************************************/

export const getPosts = createAsyncThunk('posts/getPosts',

    async (subbRedditUrl) => { // function runs when asyncThink executed

        /* First get data of all posts of chosen Sub Reddit (via subbRedditUrl) */
        const subRedditData = await RedditAPIcalls.getSubRedditPosts(subbRedditUrl);

        /* In below function used to create Post objects (containing relevant data), Promise.all() 
           is used to wait for all comment-fetching to finish (using getComments()) */
        const subRedditPosts = await Promise.all( 
            subRedditData.data.children.map(async(child) =>{

                comments = await getComments(child.data.permalink); // get all comments for post using post's permalink

                return { // created Post object
                    title:      child.data.title,     // get post author
                    author:     child.data.author,    // get post title
                    avatar:     '',                   // author's avatar image url
                    ups:        child.data.ups,       // get post upvotes
                    permalink:  child.data.permalink, // stores posts's permalink (if needed later)

                    img:    (child.data.thumbnail && child.data.thumbnail!=="" && child.data.thumbnail !=="self"
                                ? (child.data.thumbnail) // gets image thumbnail url if it exists
                                : null
                            ),

                    video: (child.data.secure_media !== null  // get video clip url of post if it's there
                                ? ({ vidUrl: child.data.secure_media.fallback_url, 
                                    width:   child.data.secure_media.width, 
                                    height:  child.data.secure_media.height })
                                : null
                            ),

                    showComments:    false, // used to toggle if comments is visible or not
                    comments:     comments, // stores comments array variable here
                    loadingComments: false, // is comment loading or not..
                    errorComments:   false  // is there error in retrieving comments.. 
                };
            })
        );

        return subRedditPosts; // returns all posts for Sub Reddit
    }
);

/***********************************************************************************
    Below async function is used as part of the above asyncThunk 'posts/getPosts' 
    action in order to add comments array([])for each post object 
************************************************************************************/

const getComments = async (permaLink) => {
    const commentsData = await RedditAPIcalls.getPostComments(permaLink); // gets all comments based on post's permaLink

    const postComments =  commentsData.data.children.map((child) => ( // returns array of comment objects for post
        {
            author:      child.data.author,     // post author
            body:        child.data.body,       // post body/text
            createdTime: child.data.created_utc // post creation time (will modify later)
        }
    ));
    return postComments; // return array of comments
}


/***************************************************************************************************************/
/***************************************************************************************************************/
/******************* Below asycn thunk function returns all comments within a selected post ********************/
/***************************************************************************************************************/
/***************************************************************************************************************/

const postSlice = createSlice({
    name: "posts",
    initialState: { // 'store' for this slice
        posts:   [],
        error:   false,
        loading: false,
        searchTerm: '',
        subReddit_PermaLink: '/r/Home/'
    },
    reducers: { // function to interact with slice's store
        setPosts(state, action) {
            state.posts = getPosts(action.payload); // <= THIS triggers extraReducer below
        },
        getPosts(state) { // gets stored posts
            if(state.posts) {
                return state.posts
            }
        },
        setSearchTerm(state, action) { // stores search term
            state.searchTerm = action.payload;
        },
        getSearchTerm(state) { // returns stored search term
            if(state.posts) {
                return state.posts;
            }
        },
        setSubReddit_Permalink(state, action) { // sets permalink for current selected SubReddit
            state.subReddit_PermaLink = action.payload;
        },
        getSubReddit_Permalink(state) { // retruns permalink of current SubReddit
            if(state.subReddit_PermaLink) {
                return state.subReddit_PermaLink;
            }
        },
    },
    extraReducers: (builder) => { // Actions that trigger due to asyncThunk function getPosts() invoked
        builder
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPosts.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
    }

});