import React from "react";
import { useState } from "react";

import SearchHeader from "../components/searchHeader/searchHeader.js";
import SubRedditsMenu from "../components/subredditsMenu/subredditsMenu.js";
import PostsBody from "../components/postsBody/postsBody.js";

import './App.css';

const App = () => {

    const [subRedditUrl, setSubRedditUrl] = useState(''); // tracks and stores current subReddit and its url

    return(
        <>
        <div className="top">
            <SearchHeader/>
        </div>
        <div className="menu-plus-posts">
         {/* <SubredditsMenu setSubRedditUrl={setSubRedditUrl} /> */}
          {/*<SubredditsMenu />*/}
          <SubRedditsMenu setSubRedditUrl={setSubRedditUrl} />
         {/* <PostsBody subRedditUrl={subRedditUrl} /> */}
          {/* <PostsBody /> */}
          <PostsBody subRedditUrl={subRedditUrl} />
        </div>
        </>
    );
}

export default App;