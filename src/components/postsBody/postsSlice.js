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
                let video = null;               // stores embedded video data (if post has one)
                let postType = '';              // stores post type (which is used as indicator in external logic)
                let linkPreview = null;           // stores an object with embbed link data (for posts that embed external links)

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
                //const comments = await getComments(data.permalink); 

                //console.log('Post title: ',data.title,', Comments:',comments);

                /* #3: Now obtain posts's image(s) url, width, and height from metadata.
                       For multiple images, data is stored in 'media_metadata' property while
                       a single image's is stored in 'preview' property of post json object. */
                let images = []; // empty array for storage


                /* #4 Next, extract relavant meta data for the post object. 
                      There are several types Reddit posts like text, image, image gallery,
                      embedded links/videos, etc. With the extracted data, these types of 
                      posts can be recreated in Reddit-Minimal via below conditionals*/

                /* #4.1: Check if Image-Gallery post */      
                if(data.is_gallery && data.media_metadata && data.gallery_data) { 

                    postType = 'gallery'; //set post type as 'gallery'

                    const imageIds = data.gallery_data.items.map((item) => item.media_id); //stores image Ids as keys for later use

                    for (let i=0; i<imageIds.length; i++) { // For each image id, extract associated image's meta data.

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
                            const preview = img_metadata.p[index];// extract the nested image preview object from 'media_metadata'

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
                    }
                    // If there's rare issue where a "is_gallery=true" but has no valid images, flag as unavailable
                    if (images.length === 0 && data.is_gallery) {
                        galleryUnavailable = true;
                    } 
                }
                /* #4.2: Check if single image post */ 
                //data.preview && data.preview.images && data.preview.images.length > 0 
                else if(data.post_hint==="image" && data.preview && data.preview.images) {

                    postType = 'image'; // set post type as 'image'

                    /* NOTE: Whilst the 'media_metadata' field holds multiple images for a carousel, 
                             the 'preview' field only holds multiple resolutions for 1 image 
                             (since the current child post has 1 image) */
                    const imgData = data.preview.images[0];    // nested 'images' json array has only 1 image object to extract. 
                    const id      = imgData.id || 'preview_0'; // id (or placeholder) of image.

                    const resolutions = imgData.resolutions; // retrieve all available resolution from imgData
                    const index = (resolutions[3])? 3 : (resolutions.length - 1); // Get index for 4th resolution's data (or largest one available)
                    
                    const resolution = resolutions[index]; // get chosenn resolution data object via index

                    const image_url = resolution.url;    // resolution's source url
                    const width     = resolution.width;  // image's width
                    const height    = resolution.height; // images' height
                    images.push({ id, url: image_url, height, width }); // push image into images array
                }

                /* #4.3: Checks if post is an embedded-reddit video post*/ 
                else if(data.post_hint==="hosted:video" && (data.secure_media || data.media)) {

                    postType = 'hosted:video'; // set post type as 'hosted:video'

                    // 1st get media data from '.secure_media' data, otherwise from '.media'
                    if(data.secure_media && data.secure_media.reddit_video) { // 1st check 'secure_media'
                        video = { 
                                  dashUrl: data.secure_media.reddit_video.dash_url, // video url with both sound & video
                                  fallUrl: data.secure_media.reddit_video.fallback_url, // fallback video with only video, but no sound
                                  width:   data.secure_media.reddit_video.width, 
                                  height:  data.secure_media.reddit_video.height 
                                };
                    }
                    else if(data.media && data.media.reddit_video) { // if 'secure_media' falsy, then check 'media'
                        video = { 
                                  dashUrl: data.media.reddit_video.dash_url, 
                                  fallUrl: data.media.reddit_video.fallback_url, 
                                  width:   data.media.reddit_video.width, 
                                  height:  data.media.reddit_video.height 
                                };                
                    }
                }

                /* #4.4: Checks if post is an external embedded video post (ex: embedded Youtube vide)*/ 
                else if (data.post_hint==="rich:video") {
                    postType = 'rich:video'; // set post type as 'rich:video'

                    /* For 'rich:video' there are 4 tags with necessary data 
                      ("media", "media_embed", "secure_media", or "secure_media_embed")
                      We'll 1st get data from "secure_media" with "media" as fallback */

                    // If secure_mediea OR media exists, get 'oembed' tag's data.
                    const oembed = data.secure_media?.oembed || data.media?.oembed; 

                    // If oembed truthy, get data from 'html' tag, which is an html-escaped string
                    const iframeHTML = oembed?.html; 

                    if(iframeHTML) { // if iframe data exists

                        /* Below function handles html-escaped string data by decoding HTML-escaped 
                           characters (like &lt;, &gt;, &amp;) into their actual symbols (like <, >, &) */
                        const decodeHTML = (html) => { 
                        //const txt = document.createElement("div");
                        const txt = document.createElement("textarea"); // create new <textarea> element (not appended to DOM). 
                                                                        // browser treats its .innerHTML as real HTML.

                        txt.innerHTML = html; // set encoded HTML string as content of <textarea>.
                                               // browser automatically interprets HTML entities like &lt; as "<"

                        return txt.value; // Retrieves decoded string from .value property 
                                          // (which returns the raw text inside <textarea>)      
                        /* 
                         Decoded string can now look something like:
                        <iframe width="356" height="200" src="https://www.youtube.com/embed/dOyXdwXt8d4" >
                        </iframe>
                        */
                        };

                        const decodedIframe = decodeHTML(iframeHTML); // decode iframeHTML data and save it

                        video = { // finally save data for video object
                            embedHtml:   decodedIframe, // iframe string ready to inject into DOM via dangerouslySetInnerHTML
                            title:       oembed.title,
                            width:       oembed.width,
                            height:      oembed.height,
                            thumbnail:   oembed.thumbnail_url, // thumbnail hieght
                            thumbHeight: oembed.thumbnail_height,
                            thumbWidth:  oembed.thumbnail_width,
                            provider:    oembed.provider_name, //ex: 'Youtube'
                            author:      oembed.author_name
                        };
                    }
                }

                /* #4.5: Checks if post-type is an embedded article/link */
                else if (data.post_hint==="link") {
                    postType = 'link'; // set post type as 'link'

                    const previewImages = data.preview.images[0];  // nested 'images' json array has only 1 image object to extract. 
                    const resolutions = previewImages.resolutions; // retrieve all available resolution from image data
                    const index = resolutions[3] ? 3 : resolutions.length - 1; // Get index for 4th resolution's data 
                                                                               // (or largest one available)
                    const previewImage = resolutions[index]; // save chosen image

                    /*Create link preview object */
                    linkPreview = {
                        url: data.url_overridden_by_dest || data.url, // url of embedded link
                        title: data.title,                            // use for alt placeholder
                        domain: data.domain,                          // domain of link
                        thumbUrl: previewImage.url,                   // thumbnail image's url 
                        //thumbWidth: previewImage.width,               // thumbnail's width
                        //thumbHeight: previewImage.height,             // thumbnail's width  
                    };
                }

                /* #4.6: If post type if 'self' or is undefined, there may be embeeded reddit links
                         or video(s) without a properly defined 'post_hint' tag in post's JSON object. 
                         Examine the post object to determine on a case-by-case basis what type of post 
                         is it and extract the relevant data. */
                else if (data.post_hint==="self" || !data.post_hint) {

                    // Start by getting the post's url link if it exists.
                    const postUrl = (data.url || data.url_overridden_by_dest) || '';

                    // Then check if the link is a reddit domain link
                    const RedditLink = (  
                        postUrl.includes('www.reddit.com') ||
                        postUrl.includes('i.redd.it') ||
                        postUrl.includes('v.redd.it') 
                    );

                    // CASE #1: post url that isn't a reddit link is an external embedded link
                    if(postUrl && !RedditLink) { 
                        
                        // save external url to link preview to display in postsBody.js
                        linkPreview = {  url: postUrl }                        

                        postType='self'; // set postType='self' as flag to indicate embedded external url
                    }

                    // CASE #2: post has embedded reddit hosted video
                    else if(postUrl && postUrl.includes('v.redd.it')) {

                        postType = 'hosted:video'; // set post type as 'hosted:video'

                        // first get media data from '.secure_media' data, otherwise from '.media'
                        if(data.secure_media && data.secure_media.reddit_video) { // 1st check 'secure_media'
                            video = { 
                                      dashUrl: data.secure_media.reddit_video.dash_url, // video url with both sound & video
                                      fallUrl: data.secure_media.reddit_video.fallback_url, // fallback video with only video, but no sound
                                      width:   data.secure_media.reddit_video.width, 
                                      height:  data.secure_media.reddit_video.height 
                                    };
                        }
                        else if(data.media && data.media.reddit_video) { // if 'secure_media' falsy, then check 'media'
                            video = { 
                                      dashUrl: data.media.reddit_video.dash_url, 
                                      fallUrl: data.media.reddit_video.fallback_url, 
                                      width:   data.media.reddit_video.width, 
                                      height:  data.media.reddit_video.height 
                                    };                
                        }
                    }
                    // CASE #3: post has image despite being post_hint='self' or none.
                    //          Same logic as earlier conditional where post_hint=='image'
                    else if (data.preview && data.preview.images){

                        postType = 'image'; // reset post type as 'image'

                        const ImgData = data.preview.images[0];  // should be first and only image object to extract. 
                        const id      = ImgData.id || 'preview_0'; // id (or placeholder) of image.
    
                        const resolutions = ImgData.resolutions; // retrieve available resolutions from imgData
                        const indx = (resolutions[3])? 3 : (resolutions.length - 1); // Get index for 4th resolution's data (or largest one available)
                        
                        const resolution = resolutions[indx]; // get chosen resolution via index
    
                        const image_url = resolution.url;    // get image's url, width, and heigth
                        const width     = resolution.width;  
                        const height    = resolution.height;

                        images.push({ id, url: image_url, height, width }); // push image into images array

                    }
                    else { // More cases will be added as found..
                        postType=''; // otherwise, set postType empty. This is a placeholder.
                    }
                }

                /* #5: FINALLY create and return post's object*/
                return { 
                    // General post data
                    postType:   postType,             // tells component WHAT type of post is stored in object
                    title:      child.data.title,     // post title
                    author:     child.data.author,    // post title (note: there's no avatar icon found in json)
                    created:    child.data.created,   // time of post's creation (in unix Time)
                    ups:        child.data.ups,       // post upvotes
                    permalink:  child.data.permalink, // stores post's permalink (used later for getting comments)
                    text:       child.data.selftext || "",  // If there's accompanying text within post 
                    num_comments: child.data.num_comments, 

                    // Media data
                    images:     images,      // save images [] here
                    galleryUnavailable:  galleryUnavailable || false, // true if gallery existed but is missing
                    video:      video,       // save video data here here
                    linkPreview: linkPreview || {}, // saves linkPreview object (for embedded link posts)

                    // Rest of data for handling comments
                    showComments:    false, // used to toggle if comments is visible or not
                    //comments:     comments, // stores comments array variable here
                    loadingComments: false, // is comment loading or not..
                    errorComments:   false  // is there error in retrieving comments.. 
                };
            })
        )

        return subRedditPosts; // returns all posts for Sub Reddit
    }
)


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