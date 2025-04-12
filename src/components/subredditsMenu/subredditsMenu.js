import React from "react";          
import { useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';

import {getSubReddits} from './menuSlice.js';

import './subredditsMenu.css';

//const SubredditsMenu = ({setSubRedditUrl}) => {

const SubredditsMenu = () => {

    // Track currently selected Sub Reddit
    const [selected, setSelected] = useState('/r/Home/'); // sets default subReddit to 'Home' subreddit

    // import state from menuSlice
    const subReddits = useSelector(state => state.menu.subReddits);
    const status     = useSelector(state => state.menu.status);
    const error      = useSelector(state => state.menu.error);

    const dispatch = useDispatch(); // for dispatching menuSlice.js functions

    useEffect(()=>{ 
        /* runs getSubReddits() and stores subReddit values into state */
        dispatch(getSubReddits());
    },[]); 

    const handleClick = (subRedditUrl) => {
        setSelected(subRedditUrl);
    }

    return (
        // Return subreddits' params value in menu
        <div className="subreddits-menu">
            <h3>Subreddits</h3>
            <div className="subreddits-container">
                {status === 'loading' && <h2>loading....</h2>}
                {status === 'failed' && <h2>Error is: {error}</h2>}
                {(status === 'succeeded' && subReddits && subReddits.length>0)
                ?subReddits.map((subReddit) => {
                    return (
                            <div 
                                className={selected!==subReddit.url? "subreddit-item": "subreddit-item-clicked"}
                                onClick={() => handleClick(subReddit.url)}
                            >
                                <img src={subReddit.iconUrl || 'images/no-image-icon.png'} 
                                    alt={subReddit.title} 
                                    className="icon-img"
                                    style={{border: `3px solid ${subReddit.color}`}} 
                                    />
                                <div>{subReddit.title}</div>
                            </div>
                            );
                    })
                :null
                }
            </div>
        </div>
    );
};

export default SubredditsMenu;