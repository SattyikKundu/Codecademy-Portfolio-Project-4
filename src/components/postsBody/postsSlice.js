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

                let data;                       // Stores extracted 1st nested layer of 'child' 
                let galleryUnavailable = false; // Flags if originally existing gallery is somehow unavailable

                /* #1: First, get the post object's, or child's, data.  
                        In rare cases, all post data is stored further within an attribute 
                        called 'crosspost_parent_list'. If crosspost_parent_list exists, use 
                        the nested item in as data. */
                if (child.data.crosspost_parent_list && child.data.crosspost_parent_list.length > 0) { 
                    data = child.data.crosspost_parent_list[0]; 
                } else {  
                    data = child.data;  // Otherwise use original post data
                }


                /* #2 Use getComments() function (from later in file) to extract all comments
                      using the posts' permalink. Comments are stored in an array.  */
                const comments = await getComments(data.permalink); 


                /* #3: Now obtain posts's image(s) url, width, and height from metadata.
                       For multiple images, data is stored in 'media_metadata' property while
                       a single image's is stored in 'preview' property of post json object. 
                */
                let images = []; // empty array for storage
                if(data.media_metadata && data.gallery_data) { // Checks if 'media_metadata' (which hold images's data) 
                                                               // and associated 'gallery_data' (which stores image Ids) exist..

                    const imageIds = data.gallery_data.items.map((item) =>  item.media_id); //stores image Ids as keys for later use

                    for (let i=0; i<imageIds.length; i++) { // for each image id, extract associated image's meta data.

                        const id = imageIds[i];                       // get current id
                        const img_metadata = data.media_metadata[id]; // get image object that with id-value as key

                        if (img_metadata && img_metadata.p && img_metadata.p.length>0) { // If preview images available

                            /* Below: Checks if image resolution at index 3 (4th resolution) is available.
                                      Otherwise, return largest available resolution. A rare, but SEVERE, issue 
                                      occurs when when NOT all 6 images resolution options are available despite 
                                      being shown on a SubReddit's JSON. Hence, below code first checks if the 
                                      preferred 4th image resolution data is available; OTHERWISE, fall back 
                                      to current highest resolution available from within data to avoid failure. */
                            const index = img_metadata.p[3] ? 3 : img_metadata.p.length - 1;
                            console.log(`For post ${data.title}, SafeIndex(prev) is: `,index);
                            const preview = img_metadata.p[index];// extract the nested image preview object from 'media_metadata'
                           /* if (!preview?.u || !preview?.x || !preview?.y) {
                                console.warn('Malformed preview data:', preview, 'post id:', id);
                                continue;
                            }*/

                            const image_url = preview.u; // preview image's url location
                            const width = preview.x;     // preview image's width
                            const height = preview.y;    // preview image's height

                            /* OPTIONAL: Below takes params from source file and not from selected resolution like below */
                            //const image_url = img_metadata.s.u; // images too big 
                            //const height = img_metadata.s.y;
                            //const width = img_metadata.s.x;

                            // push current image object into 'images' array
                            images.push({id: id, url: image_url, height: height, width: width});

                        }
                        /*else { // Safety code....
                            console.warn('Missing previews (p[]) for image id:', id);
                        }*/
                    }

                    // If there's rare issue where a "is_gallery=true" but has no valid images, flag as unavailable
                    if (images.length === 0 && data.is_gallery) {
                        galleryUnavailable = true;
                    } 

                } 
                /* Whilst the 'media_metadata' field holds multiple images for a carousel, the
                   'preview' field only holds multiple resolutions for 1 image 
                    (since the current child post has 1 image) */
                else if(data.preview && data.preview.images && data.preview.images.length > 0) { // Checks if 'preview' exists and has data.

                    const imgData = data.preview.images[0];    // nested 'images' json array has only 1 image object to extract. 
                    const id      = imgData.id || 'preview_0'; // store id (or placeholder) of image.

                    const resolutions = imgData.resolutions; // retrieve all available resolution from imgData
                    const index = resolutions[3] ? 3 : resolutions.length - 1; // Get index for 4th resolution's data (or largest one available)
                    //const index =  resolutions.length - 1;
                    //console.log(`For post ${data.title}, SafeIndex(prev) is: `,index);
                    
                    const resolution = resolutions[index]; // get chosenn resolution data object via index

                    const image_url = resolution.url;    // resolution's source url
                    const width     = resolution.width;  // image's width
                    const height    = resolution.height; // images' height
                    images.push({ id, url: image_url, height, width }); // push image into images array

                    /*
                    if (!res?.url || !res?.width || !res?.height) {
                        console.warn('Malformed resolution in preview:', res, 'post id:', id);
                    } else {
                        const image_url = res.url;
                        const width = res.width;
                        const height = res.height;
                        images.push({ id, url: image_url, height, width });
                    } */

                    /* OPTIONAL: Below takes params from source file and not from selected resolution like below */
                    //const image_url = imgData.source.url; 
                    //const width     = imgData.source.width;
                    //const height    = imgData.source.height;
                }        

                // detect and retrieve video file (if it exists)
                let video = null;
                if(data.secure_media && data.secure_media.reddit_video) { // 1st check 'secure_media'

                    video = { 
                              dashUrl: data.secure_media.reddit_video.dash_url, // video url with both sound & video
                              fallUrl: data.secure_media.reddit_video.fallback_url, // fallback video with only video, but no sound
                              width:   data.secure_media.reddit_video.width, 
                              height:  data.secure_media.reddit_video.height 
                            };
                }
                else if(data.media && data.media.reddit_video) { // if 'secure_media' falsy, then check 'media' tag
                    video = { 
                              dashUrl: data.media.reddit_video.dash_url, 
                              fallUrl: data.media.reddit_video.fallback_url, 
                              width:   data.media.reddit_video.width, 
                              height:  data.media.reddit_video.height 
                            };                
                }

                return { /* FINALLY create post object*/
                    title:      child.data.title,     // get post author
                    author:     child.data.author,    // get post title
                    created:    child.data.created,   // get time of post's creation (in unix Time)
                    avatar:     '',                   // author's avatar image url
                    ups:        child.data.ups,       // get post upvotes
                    permalink:  child.data.permalink, // stores posts's permalink (if needed later)
                    text:       (child.data.selftext || ""),  // If there's accompanying text within post 

                    images:              images, // save images [] here
                    galleryUnavailable:  galleryUnavailable || false, // true if gallery existed but is missing

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