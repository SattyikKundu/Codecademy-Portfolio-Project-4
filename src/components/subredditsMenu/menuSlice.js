import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RedditAPIcallsfrom from "../../utils/redditAPIcalls/redditAPIcalls";

/* AsyncThunk() for extracting data for creating subReddit choices for menu  */
export const getSubReddits = createAsyncThunk('menu/getSubReddits', // links to extraReducers in 'menu' slice

    async ()=>{ // asycn function that run on extraReducer trigger

        const data = await RedditAPIcallsfrom.getSubReddits(); // get All subreddits from json (unable to add await?)

        const subRedditsArray = data.data.children.map((child)=>( // returns array of menu item objects
            { 
                iconUrl: child.data.icon_img,
                color:   child.data.primary_color,
                title:   child.data.display_name,
                //url:     child.data.url || ''
                url:     RedditAPIcallsfrom.getSubRedditUrl(child.data.url || '')
            }
        ));
        return subRedditsArray; // return array with sub Reddits' information for menu
    }
)

const menuSlice = createSlice({
    name: "menu",
    initialState: {
        subReddits: [],
        status: 'idle',
        error: ''
    },
    reducers: {},
    extraReducers: (builder) => { // triggers when getSubReddits() executes
        builder
        .addCase(getSubReddits.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getSubReddits.rejected, (state, action) => {
            state.status = 'failed';
            state.error  = action.error.message;
        })
        .addCase(getSubReddits.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.subReddits = action.payload;
        })
    }
});

export default menuSlice.reducer; // exports slice

