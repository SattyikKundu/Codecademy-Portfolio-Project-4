import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";

const PostsBody = ({ subRedditUrl }) => {

    const [subRedditUrl, getSubRedditUrl] = useState('');



    return (
        <div>
            <p>Posts of chosen subreddit goes here...</p>
        </div>
    );
};

export default PostsBody;