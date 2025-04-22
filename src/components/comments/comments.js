import React from "react";
import {useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import ReactMarkdown from 'react-markdown'; // used to handle and render markdown text 
                                            // to look like normal text in React app

import { getComments } from "./commentsSlice.js"; // asyncThunk function that retrieves posts 
                                                  // based on subreddit url through the 'posts' slice.

import { timeAgo } from "../../utils/otherHelpers.js"; // function converts unix time to 'seconds ago', 'minutes ago', etc...

import './comments.css'; // styling

const PostComments = ({permalink}) => {

        // imported states from commentsSlice.js 
        const comments = useSelector(state => state.comments.commentsByPost[permalink]); // tracks comments for SELECTED post permalink
        const status   = useSelector(state => state.comments.status);
        const error    = useSelector(state => state.comments.error);

        const dispatch = useDispatch();

        useEffect(()=>{
            if(permalink) {
                dispatch(getComments(permalink)); // triggers getComments() from slice, which
                                                  // then uploads to the imported state variables above
            }
        },[permalink]);

        const renderComments = (comments) => { // function that returns comments rendered in html format
            return(
                <div className="comments-container">
                    {
                        comments.map((comment) => (
                            /* React.Fragment lets you group multiple elements without 
                               adding extra DOM nodes. Especially useful for recursive 
                               components to avoid unnecessary wrapper <div>s.
                               Usage: <React.Fragment> OR shorthand <> </> */
                            <React.Fragment>
                            <div className="comment" key={comment.id} 
                                style={{marginLeft: `${40*comment.depth}px`}}>
                                <div className="comment-info">
                                    <div className="author">
                                        <div className="icon">
                                            <img src={'images/avatar-user-icon.png'}/>
                                        </div>    
                                        <div className="name">{comment.author}</div>
                                    </div>
                                    <div className="comment-time">{timeAgo(comment.created)}</div>
                                </div>
                                <div className="comment-text"><ReactMarkdown>{comment.text}</ReactMarkdown></div>
                            </div>
                            {/* Below recursively runs renderComments() again to render nested reply comments */}
                            {
                                (comment.replies && comment.replies.length>0) && 
                                renderComments(comment.replies)
                            }
                            
                            </React.Fragment>
                        ))
                    }
                </div>
            )
        }

        if (status === 'loading') {
            return (
                <p>Loading Comments....</p>
            )
        }

        if (status === 'failed') {
            return (
                <p> Failed Msg: {error}</p>
            )
        }

        if (status === 'succeeded' && comments) {
            return(
                renderComments(comments)
            )
        }
};

export default PostComments;