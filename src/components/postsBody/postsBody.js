import React from "react";
import {useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import ReactMarkdown from 'react-markdown'; // used to handle and render markdown text 
                                            // to look like normal text in React app

import { setPosts, 
    getAllPosts, 
    setSearchTerm,
    getSearchTerm,
    setSubReddit_Permalink,
    getSubReddit_Permalink} from './postsSlice.js';

import {VideoHolder, ImageHolder} 
from "./mediaHolder/mediaHolder.js"; // Custom component functions used to handle any images & video 

import { getPosts } from "./postsSlice.js";

import './postsBody.css';

console.log('getPosts:',getPosts);

const PostsBody = ({ subRedditUrl }) => {

    //console.log('subRedditUrl: ',subRedditUrl);
    const posts  = useSelector(state => state.posts.posts);
    const status = useSelector(state => state.posts.status);
    const error  = useSelector(state => state.posts.error);

    const dispatch = useDispatch();

    useEffect(() => {
        /*
        if (subRedditUrl) {
            dispatch(getPosts(subRedditUrl));
        } */
        const asyncSubFetch = async () => {
            if (subRedditUrl) {
                dispatch(getPosts(subRedditUrl));
            }   
        }
        asyncSubFetch();
    },[subRedditUrl]);


    return (
        <div className="all-posts">
            {status  === 'loading' && <h2>loading....</h2>}
            {status  === 'failed' && <h2>Error is: {error}</h2>}
            {(status === 'succeeded' && posts && posts.length>0) 
                ?(posts.map((post)=>{
                    return (
                    <div className="post" key={post.permalink}>
                        <h2 className="title">{post.title}</h2>
                        { (post.video || (post.images && post.images.length>0)) && // checks if post.video or post.images exist...
                            // If video exists, prioritize rendering it, otherwise render image(s) instead
                            (post.video)?  (<VideoHolder video={post.video} />) : (<ImageHolder images={post.images} />)
                        }
                        <div className="body-text"
                             style={{
                               display: (post.text===''|| post.text===null) && 'none' // remove text block if empty
                             }}
                        ><ReactMarkdown>{post.text}</ReactMarkdown> 
                        </div >
                        <div className="up-votes">{post.ups}</div>
                    </div> 
                    )
                }))
                : (null)
            }
        </div>
    );
};

export default PostsBody;