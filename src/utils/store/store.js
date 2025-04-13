import { configureStore} from "@reduxjs/toolkit";

import subRedditsMenuReducer from '../../components/subredditsMenu/menuSlice.js';
import subRedditPostsReducer from '../../components/postsBody/postsSlice.js';

const store = configureStore({
    reducer: {
       menu : subRedditsMenuReducer,
       posts: subRedditPostsReducer
    }
});

export default store;