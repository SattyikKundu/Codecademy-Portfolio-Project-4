import React from "react";          
import { useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';

import {getSubReddits} from './menuSlice.js';

const SubredditsMenu = () => {

    // import state from menuSlice
    const subReddits = useSelector(state => state.menu.subReddits);
    const status     = useSelector(state => state.menu.status);
    const error      = useSelector(state => state.menu.error);

    const dispatch = useDispatch(); // for dispatching menuSlice.js functions

    useEffect(()=>{ 
        /* runs getSubReddits() and stores subReddit values into state */
        dispatch(getSubReddits());
    },[]); 

    return (
        // Return subreddits' params value in menu
        <div>
            {status === 'loading' && <p>waiting....</p>}
            {status === 'failed' && <p>Error is: {error}</p>}
            {(status === 'succeeded' && subReddits && subReddits.length>0)?
              subReddits.map((subReddit, k) => {
                return (<div key={k}>
                            <img src={subReddit.iconUrl} alt={subReddit.title} style={{width:'30px', height:'30px'}} />
                            <p>{subReddit.title}</p>
                            <p>{subReddit.iconUrl}</p>
                        </div>);
              }): null
            }
        </div>
    );
};

export default SubredditsMenu;