import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";

import { setPosts, 
    getAllPosts, 
    setSearchTerm,
    getSearchTerm,
    setSubReddit_Permalink,
    getSubReddit_Permalink} from './postsSlice.js';

import { getPosts } from "./postsSlice.js";

import './postsBody.css';

console.log('getPosts:',getPosts);

const PostsBody = ({ subRedditUrl }) => {

    console.log('subRedditUrl: ',subRedditUrl);
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
          {/*}  <p>Posts of chosen subreddit goes here...</p> 
            <p>Full sub reddit url: {subRedditUrl}</p> */}
            {status  === 'loading' && <h2>loading....</h2>}
            {status  === 'failed' && <h2>Error is: {error}</h2>}
            {(status === 'succeeded' && posts && posts.length>0) 
                ?(posts.map((post)=>{
                    return (
                    <div className="post" key={post.permalink}>
                    {/*}    <p>Title: {post.title}</p>
                        <p>Author: {post.author}</p>
                        <p>Upvotes: {post.ups}</p>
                        <p>Image?: {(post.image) ? post.image: 'none'} </p>
                        <p>Video?: {(post.video) ? post.video.vidUrl: 'none'}</p>
                        <p>Comments?: {(post.comments && post.comments.length>0) ? post.comments.length:'none'}</p> */}
                        <h2 className="title">{post.title}</h2>
                        <div className="media-body">
                            {
                                (post.video)? 
                                (<video className='post-vid' width={post.video.width} height={post.video.height} controls>
                                    <source src={post.video.vidUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                ): 
                                (
                                    <img className='post-img' src={post.image} alt="img visual"/>
                                )
                            }
                        </div>
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