import { configureStore} from "@reduxjs/toolkit";

import subRedditsMenuReducer from '../../components/subredditsMenu/menuSlice.js';

const store = configureStore({
    reducer: {
       menu : subRedditsMenuReducer
    }
});

export default store;