import React from "react";
import { useState } from "react";

import SearchHeader from "../components/searchHeader/searchHeader.js";
import SubredditsMenu from "../components/subredditsMenu/subredditsMenu.js";
import PostsBody from "../components/postsBody/postsBody.js";


const App = () => {

    const [subRedditUrl, setSubRedditUrl] = useState(''); // tracks and stores current subReddit and its url

    return(
        <>
        <div className="top">
            <SearchHeader/>
        </div>
        <div className="body">
          {/*  <SubredditsMenu setSubRedditUrl={setSubRedditUrl} /> */}
            <SubredditsMenu />
            <PostsBody />
        </div>
        </>
    );
}

export default App;