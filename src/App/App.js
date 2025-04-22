import React from "react";
import { useState } from "react";

import SearchHeader from "../components/searchHeader/searchHeader.js";
import SubRedditsMenu from "../components/subredditsMenu/subredditsMenu.js";
import PostsBody from "../components/postsBody/postsBody.js";

import './App.css';

const App = () => {

    const [subRedditUrl, setSubRedditUrl] = useState(''); // tracks and stores current subReddit and its url
    const [subPermalink, setSubPermalink] = useState('');

    return(
        <>
        <div className="top">
            <SearchHeader subPermalink={subPermalink} />
        </div>
        <div className="menu-plus-posts">
          <SubRedditsMenu 
            setSubRedditUrl={setSubRedditUrl} 
            setSubPermalink={setSubPermalink} 
          />
          <PostsBody subRedditUrl={subRedditUrl} />
        </div>
        </>
    );
}

export default App;