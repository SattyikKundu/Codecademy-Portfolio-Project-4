import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../postsBody/postsSlice';

import './searchHeader.css';

const SearchHeader = ({subPermalink}) => {

    const [localInput, setLocalInput] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = () => {
        dispatch(setSearchTerm(localInput));
    }

    const handleClear = () => {
        setLocalInput('');
        dispatch(setSearchTerm(''));

    }

    useEffect(() => {
        setLocalInput(''); // resets localInput (when new sub reddit is selected)
    },[subPermalink])

    return (
        <div className='search-header'>
            <div className='reddit-logo'>
                <div className='icon'>
                    <img src='images/reddit-icon.png' />
                </div>
                <div className='logo-name'>Reddit</div>
            </div>
            <div className='search-box-area'>
                    <div 
                        className='current-subReddit'
                        onClick={handleClear}
                    >
                        {subPermalink}
                    </div>
                    <input 
                        className='search-input-box'
                        onChange={(event) => setLocalInput(event.target.value)} 
                        type='text' 
                        placeholder=' Enter your search here...'
                    />
                <button type='button' onClick={handleSubmit}>🔍</button>
            </div>
            <button 
                className='clear-search' 
                type='button' 
                onClick={handleClear}
            >
                Clear Search
            </button>
        </div>
    );
};

export default SearchHeader;