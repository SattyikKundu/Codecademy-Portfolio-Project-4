import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RedditAPIcalls from '../../utils/redditAPIcalls/redditAPIcalls.js';


/***************************************************************************************************************/
/***************************************************************************************************************/
/***************** Below asycn thunk function returns all posts within provided Sub-Reddit url *****************/
/***************************************************************************************************************/
/***************************************************************************************************************/

export const getPosts = createAsyncThunk('posts/getPosts',

    async (subbRedditUrl) => { // function runs when asyncThink executed

        // First get data of all posts of chosen Sub Reddit (via subbRedditUrl) 
        const subRedditData = await RedditAPIcalls.getSubRedditPosts(subbRedditUrl);

        // In below function used to create Post objects (containing relevant data), Promise.all() 
        // is used to wait for all comment-fetching to finish (using getComments()) 
        const subRedditPosts = await Promise.all( 
            subRedditData.data.children.map(async(child) =>{


                const data = child.data; // extract 1st nested layer of 'child' 
                const comments = await getComments(data.permalink); // get all comments for post using post's permalink

                let images = [];
                if(data.media_metadata && data.gallery_data) {

                    const imageIds = data.gallery_data.items.map((item) =>  item.media_id); // stores 'id' of images

                    for (let i=0; i<imageIds.length; i++) { // for each image id...
                        const id = imageIds[i];
                        const img_metadata = data.media_metadata[id]; // get image object that with id-value as key

                        if (img_metadata && img_metadata.p && img_metadata.p.length>2) { // If number of preview images >2 ...
                                                    
                            //const image_url = img_metadata.s.u; //<== experiment with source file later

                            const image_url  = img_metadata.p[2].u;
                            const height = img_metadata.p[2].y;
                            //const width = img_metadata.p[2].x;
                            images.push({id: id, url: image_url, height: height});
                        }
                    }

                } else if(data.preview && data.preview.images && data.preview.images.length > 0) { // There should only be 1 image

                    const imgData = data.preview.images[0]; // gets image object of the sole image 

                    //const image_url = imgData.source.url; // <== experiment with source image later

                    const id        = imgData.id || 'preview_0';
                    const image_url = imgData.resolutions[2].url; // get 3rd image
                    const height    = imgData.resolutions[2].height;
                    //const width     = imgData.resolutions[2].width;

                    images.push({id: id, url: image_url, height: height});
                }
                

                // detect and retrieve video file (if it exists)
                let video = null;
                if(data.secure_media && data.secure_media.reddit_video) { // 1st check 'secure_media'
                    video = { vidUrl: data.secure_media.reddit_video.fallback_url, 
                              width:  data.secure_media.reddit_video.width, 
                              height: data.secure_media.reddit_video.height };
                }
                else if(data.media && data.media.reddit_video) { // then check 'media'
                    video = { vidUrl: data.media.reddit_video.fallback_url, 
                              width:  data.media.reddit_video.width, 
                              height: data.media.reddit_video.height };                
                }

                return { // created Post object
                    title:      child.data.title,     // get post author
                    author:     child.data.author,    // get post title
                    avatar:     '',                   // author's avatar image url
                    ups:        child.data.ups,       // get post upvotes
                    permalink:  child.data.permalink, // stores posts's permalink (if needed later)
                    text:       (child.data.selftext || ""),  // If there's accompanying text within post 

                    images:      images, // save thumbnail_image here
                    video:      video, // save video clip here

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
        status: 'idle',
        searchTerm: '',
        subReddit_PermaLink: '/r/Home/'
    },
    reducers: { // function to interact with slice's store
        setPosts(state, action) {
            state.posts = getPosts(action.payload); // <= THIS triggers extraReducer below
        },
        getAllPosts(state) { // gets stored posts
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
                state.status = 'loading';
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
    }

});

export const {
    setPosts, 
    getAllPosts, 
    setSearchTerm,
    getSearchTerm,
    setSubReddit_Permalink,
    getSubReddit_Permalink
    } = postSlice.actions;

export default postSlice.reducer; // exports slice