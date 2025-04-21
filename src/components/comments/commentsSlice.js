import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RedditAPIcalls from '../../utils/redditAPIcalls/redditAPIcalls.js';

/***************************************************************************************************************/
/***************************************************************************************************************/
/********* Below is an async thunk function returns all comments for a post using it's permalink ***************/
/***************************************************************************************************************/
/***************************************************************************************************************/

export const getComments = createAsyncThunk('comments/getComments',

    async (postPermalink) => {

        // First, get post's JSON data that has all comments
        const rawJSONCommentsData = await RedditAPIcalls.getPostComments(postPermalink); 

        /* Next, create function that recursively builds structured comments 
           in order to both store and track the nesting of comments */
        const createNestedComments = (children, depth=0) => { //

            return children
                .filter(child => child.kind==='t1') // filter nested objects of children by tag kind='1', 
                                                    // which means object holds comment

                .map((child) => {
                    const data = child.data; // get nested 'data' from child

                    return { // return comment object with key values
                        id:      data.id,       // comment id
                        author:  data.author,   // comment author
                        text:    data.body,     // comment text itself
                        created: data.created,  // comment's creation time (unix time)
                        depth:   depth,         // depth-level of comment (0 it outermost/parent level)

                        replies: (data.replies?.data) // if data has .replies.data, get nested .children 
                                                      // to recursively get new comments
                                ? createNestedComments(data.replies.data.children, depth+1)
                                : [] // if no reply, return empty array []
                    }
                });
        }

        /* create and return array of nested comments for post */
        const postComments = createNestedComments(rawJSONCommentsData.data.children); 
        return {postPermalink, postComments}; // store associated post's permalink with comments.
    }
);


const commentsSlice = createSlice({
    name:"comments",
    initialState: { // store for this slice
        commentsByPost: {}, 
        /* Store objects with permalink and associated posts. Example:
         *   commentsByPost: {
         *       "/r/Home/comments/abc123": [
         *           { id: "c1", text: "Great post!", depth: 0, replies: [...] },
         *           { id: "c2", text: "I agree!", depth: 0, replies: [...] }
         *       ],
         *       "/r/Home/comments/xyz456": [
         *          { id: "c3", text: "Interesting insight.", depth: 0, replies: [...] }
         *      ]
         *   }
         */
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => { // Actions that trigger due to asyncThunk function getComments() invoked
        builder
            .addCase(getComments.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { postPermalink, postComments } = action.payload;
                state.commentsByPost[postPermalink] = postComments; // If 'succeeded', store {permalink, comments}
            })
    }
});

export default commentsSlice.reducer;