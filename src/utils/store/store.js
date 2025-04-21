import { configureStore} from "@reduxjs/toolkit";

import subRedditsMenuReducer from '../../components/subredditsMenu/menuSlice.js';
import subRedditPostsReducer from '../../components/postsBody/postsSlice.js';
import postCommentsReducer   from '../../components/comments/commentsSlice.js';

const store = configureStore({
    reducer: {
       menu : subRedditsMenuReducer,
       posts: subRedditPostsReducer,
       comments: postCommentsReducer
    }
});

export default store;