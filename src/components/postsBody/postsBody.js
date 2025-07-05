import { useState, useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";

import ReactMarkdown from 'react-markdown'; // used to handle and render markdown text 
                                            // to look like normal text in React app

import { getPosts } from "./postsSlice.js"; // asyncThunk function that retrieves posts based on subreddit url 
                                            // through the 'posts' slice.

import { timeAgo, numberFormatter} from "../../utils/otherHelpers.js"; // helps format creation time(seconds) and large numbers

import VideoHolder from "../mediaHolder/videoHolder.js"; // Import various media handling components
import ImageHolder from "../mediaHolder/imageHolder.js"; 
import LinkHolder  from "../mediaHolder/linkHolder.js";   

import PostComments from "../comments/comments.js"; // Import <PostComments> for hanlding each post's comments

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCircleUp, faCircleDown, faMessage, faBan, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import {PulseLoader } from "react-spinners";

import './postsBody.css'; // styling file

const PostsBody = ({ subRedditUrl }) => {

    const posts      = useSelector(state => state.posts.posts); // imported states from 'posts' slice
    const status     = useSelector(state => state.posts.status);
    const error      = useSelector(state => state.posts.error);
    const searchTerm = useSelector(state => state.posts.searchTerm);

    const filtered_Posts = ( // function returns filtered posts

        (searchTerm.length > 0 && searchTerm !=='') ? //
            posts.filter( // function filters subreddit posts based on search term
                (post) => {
                    const lowerSearch = searchTerm.toLowerCase(); // converts search term to lowercase
                    return (
                        // returned title, author, text to lower case to ensure 'case-insensitive' comparison
                        post.title?.toLowerCase().includes(lowerSearch) ||
                        post.author?.toLowerCase().includes(lowerSearch) ||
                        post.text?.toLowerCase().includes(lowerSearch)
                    );
                }
            )
            : posts // otherwise return all posts.  
    );    


    /* Below useState() stores permalinks of each post together with a true/false
     * statement identifying if a posts's comment box is open or closed.
     *   Example :
     *   commentBox = {
     *      "/r/Home/comments/abc123": true, <== comment box for this post's permalink is open
     *      "/r/Home/comments/xyz456": false, <== this comment box is closed
     *   }
     */
    const [openComments, setOpenComments] = useState({}); 

    const toggleComments = (permalink) => {
        setOpenComments(
            (currentState) => {                     // extract from current version/state of 'openComments'
                const updated = { ...currentState}; // save shallow copy of previous openComments

                /* Below, toggle the associated true/false value for the permalink.
                 * Note that when a post's permalink is added to state for first time,
                 * it starts as undefined. Then when an undefined is toggled (!undefined),
                 * the posts's permalink as a key is then associated with 'true' (hence opening comments).
                 */
                updated[permalink] = !currentState[permalink]; 
                return updated;  // return updated {} as new state for setOpenComments
        });
    }


    /* Handling upvote/downvote. Needs to be done
     * for each permalink, or it updates globally. 
     */
    const [upvote, setUpvote] = useState({});
    const [downvote, setDownvote] = useState({});
    const [plusOne, setPlusOne] = useState({}); 

    const clickUp = (permalink) => { 
        let upVote   = {...upvote};
        let downVote = {...downvote};
        let pluses   = {...plusOne};
        if(downVote[permalink]) { // set downvote for permalink false
            downVote[permalink] = false; 
        } 
        if(!upVote[permalink]) { // if upvote falsy/undefined, set true and add 1
            upVote[permalink] = true; 
            pluses[permalink] = 1; 
        } 
        setUpvote(upVote); setDownvote(downVote); setPlusOne(pluses);        
    }
    const clickDown = (permalink) => { 
        let upVote   = {...upvote};
        let downVote = {...downvote};
        let pluses   = {...plusOne};
        if(upVote[permalink]) { // if upVote is already true, set to false, and NO add
            upVote[permalink] = false; 
            pluses[permalink] = 0;
        } 
        if(!downVote[permalink]) { // if downvote falsy/undefined, set true
            downVote[permalink] = true;
        }
        setUpvote(upVote); setDownvote(downVote); setPlusOne(pluses);   
    }


    /* Use dispatch and useEffect() to get all posts for subReddit url */
    const dispatch = useDispatch();
    useEffect(() => { // fetches posts on selection of subRedditUrl from menu (or on app startup default)
        const subFetch = () => { 
            if (subRedditUrl) {
                dispatch(getPosts(subRedditUrl));
            }   
        }
        subFetch();
    },[subRedditUrl]);


    // USED to keep loading screen running for testing
    /*
    const [loading, setLoading] = useState(true);
    useEffect(() => { //
      const timer = setTimeout(() => setLoading(false), 700000);
      return () => clearTimeout(timer);
    }, []); */


    const [loadingSize, setLoadingSize] = useState(100); // set dynamic loading size of  <PulseLoader /> component

    useEffect(() => { // useEffect for shrinking "loader" at under 375px;

        const updateLoaderSize = () => { // listener function 
            const width = window.innerWidth; // get current viewport/window width
            if (width >= 375) {
                setLoadingSize(100);
            } 
            else if (width < 375) {
                setLoadingSize(75);
            } 
        };
        updateLoaderSize(); // Set on mount
        window.addEventListener("resize", updateLoaderSize); // "Listen" to screen size changes
        return () => window.removeEventListener("resize", updateLoaderSize); // remove listerner on un-mount
    }, []);

    //if(loading) { // enable when testing loading notice
    if(status  === 'loading') { // whilst page is loading...
      return(
        <div className="all-posts">
            <div className="loader-notice">
                <h2>Loading Reddit posts...</h2>
                <PulseLoader size={loadingSize} color={'#797979'} />
            </div>
        </div>
      );
    }

    if(status  === 'failed') { // If post retrieval failed...
        return(
          <div className="all-posts">
            <div className="posts-error-notice">
              <h2>
                <FontAwesomeIcon 
                    icon={faCircleExclamation} 
                    style={{color:'red', 
                        border: '1.5px solid black', 
                        borderRadius: '50px'
                    }}
                />
                {' '}Error is: <span style={{color:'red'}}>{error}</span>
            </h2>
              <span>If unable to fetch posts, you likely need to wait 5-10 minutes to reload page since Reddit API limits number of fetches at a time.</span>
            </div>
          </div>
        )
    }

    if(status=== 'succeeded' && filtered_Posts && filtered_Posts.length===0) { // If there's 0 posts
      return (
        <div className="all-posts">
          <div className="posts-error-notice">
            <h2><FontAwesomeIcon 
                        icon={faBan} 
                        style={{color:'red', 
                        border: '1.5px solid black', 
                        borderRadius: '50px'
                        }}
                />{' '}No Posts found
            </h2>
            <span>Try a different search term OR select a subReddit.</span>
          </div>
        </div>  
      )
    }

    if(status === 'succeeded' && filtered_Posts && filtered_Posts.length>0) { // If total posts (filtered/unfiltered) > 0
        return (
            <div className="all-posts">
            {filtered_Posts.map((post)=>{
                return (
                    <div className="post-wrapper">
                        <div className="post" key={post.permalink}>
                            {/* .post-info holds post information on header */}
                            <div className="post-info">
                                <div className="user-info">
                                    <div className="avatar-icon">
                                       <img src={'images/avatar-user-icon.png'} />
                                    </div>    
                                    <div className="author-name">{post.author}</div>
                                </div>
                                <div className="created-time">
                                    {timeAgo(post.created)}
                                </div>
                            </div>
                            <h2 className="title">{post.title}</h2>
                            {/* Check if post uses image gallery, and then render it */}
                            {
                            (post.postType==='gallery' && post.images && post.images.length>0) 
                            ?(  // use <ImageHolder> to handle image gallery
                                <ImageHolder postType={"gallery"} images={post.images} />
                            ):(
                                post.galleryUnavailable ? 
                                ( 
                                    // Otherwise, check for rare issue where gallery existed but can't be retrieved
                                    <div className="gallery-unavailable">Gallery unavailable.</div>
                                ) 
                                : null 
                                )
                            }
                            {/* Check if post uses single image as media, and then render */}
                            {
                                (post.postType==='image' && post.images && post.images.length>0) &&
                                <ImageHolder postType={"image"} images={post.images} />
                            }
                            {/* Check if post uses reddit-host video, and then render */}
                            {
                              (post.postType==="hosted:video" && post.video) &&
                                <VideoHolder postType={"hosted:video"} video={post.video} />
                            }
                            {/* Check if post uses external embedded video (i.e. YouTube), and then render */}
                            {
                                (post.postType==="rich:video" && post.video) &&
                                <VideoHolder postType={"rich:video"} video={post.video} />
                            }
                            {/* Check if post uses embedded link to external site, and then render */}
                            {   
                                (post.postType==="link" && post.linkPreview) &&
                                <LinkHolder linkPreview={post.linkPreview} />
                            }
                            {/* Otheriwise, if postType==='self', return embedded external link */}
                            {
                                (post.postType==='self' && post.linkPreview) && (
                                    <div 
                                    className="external-embedded-link"
                                    src={post.linkPreview.url}
                                    >
                                      {post.linkPreview.url}
                                    </div>
                                )
                            }
                            {/* .body-text contains post's text as well as uses 
                                <ReactMarkdown> to handle html-escaed text */}
                            <div className="body-text"
                                style={{
                                display: (post.text===''|| post.text===null) && 'none' // remove text block if empty
                                }}
                            ><ReactMarkdown>{post.text}</ReactMarkdown>  
                            </div >

                            {/* Post footer handles upvotes/downvotes as well as opening/closing comments box */}
                            <div className="post-footer">
                                <div className="up-votes">
                                    <FontAwesomeIcon 
                                        icon={faCircleUp} 
                                        className={`circle-up ${upvote[post.permalink] ? 'upvoted' : ''}`} // button class changes on upvote (doesn't conflict 
                                                                                                           // with :hover as opposed to inline style={})
                                        onClick={()=>clickUp(post.permalink)}
                                    />
                                    <div>{numberFormatter(post.ups + (plusOne[post.permalink] ? plusOne[post.permalink] : 0))}</div>
                                    <FontAwesomeIcon 
                                        icon={faCircleDown} 
                                        className={`circle-down ${downvote[post.permalink] ? 'downvoted' : ''}`} // button class changes on downvote (doesn't 
                                                                                                                // conflict with :hover as opposed to inline style={})
                                        onClick={()=>clickDown(post.permalink)}
                                    />
                                </div>
                                <div 
                                    // Class change on comment box toggle changes background styling
                                     className={`comments-toggle ${(openComments[post.permalink] && post.num_comments>0)? 'opened': ''}`}
                                     onClick={() => toggleComments(post.permalink)}
                                >
                                    <div className="comments_num">{numberFormatter(post.num_comments)}</div>
                                    <FontAwesomeIcon className='comments-icon' icon={faMessage} />
                                </div>
                            </div>
                            <div 
                                className="comment-box"
                                style={{ // Comment box container is either opened or closed
                                    display: openComments[post.permalink] ? 'block': 'none' 
                                }}    
                            >
                                <PostComments permalink={post.permalink} />
                            </div>
                        </div> 
                    </div>
                )
            })}
            </div>
        )
    }
};

export default PostsBody;