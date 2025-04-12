import React from "react";

import SearchHeader from "../components/searchHeader/searchHeader.js";
import SubredditsMenu from "../components/subredditsMenu/subredditsMenu.js";
import PostsBody from "../components/postsBody/postsBody.js";

const App = () => {

    return(
        <>
        <div className="top">
            <SearchHeader/>
        </div>
        <div className="body">
            <SubredditsMenu />
            <PostsBody />
        </div>
        </>
    );
}

export default App;