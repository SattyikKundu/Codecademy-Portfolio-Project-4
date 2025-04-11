import React from "react";

import SearchHeader from "../components/searchHeader/searchHeader.js";
import SubredditsMenu from "../components/subredditsMenu/subredditsMenu.js";
import PostsBody from "../components/postsBody/postsBody.js";

const App = () => {

    return(
        <>
        <SearchHeader/>
        <SubredditsMenu />
        <PostsBody />
        </>
    );
}

export default App;