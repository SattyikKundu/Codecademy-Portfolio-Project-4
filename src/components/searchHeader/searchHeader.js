import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '../postsBody/postsSlice';

import './searchHeader.css';

const SearchHeader = ({subPermalink, isMenuOpened, setIsMenuOpened}) => {

    const [localInput, setLocalInput] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = () => {
        dispatch(setSearchTerm(localInput));
    }

    const handleClear = () => {
        setLocalInput('');
        dispatch(setSearchTerm(''));

    }

    const handleMenuToggle = () => {
         setIsMenuOpened(prev => !prev); //toggles the previous isMenuOpenedValue
     }


    useEffect(() => {
        setLocalInput(''); // resets localInput (when new sub reddit is selected)
    },[subPermalink])

    return (
        <div className='search-header'>
                {/* Menu open/close toggle button (available under 768px width) */}
                <div
                    onClick={handleMenuToggle}
                    className={`menu-toggle ${isMenuOpened ? '' : 'closed'}`}
                >
                  <span>{isMenuOpened ? '✖': '☰'}</span> 
                </div>

                {/* Logo and App name element */}
                <div className='reddit-logo'>
                    <div className='icon'>
                        <img src='images/reddit-icon.png' />
                    </div>
                    <div className='logo-name'>Reddit</div>
                </div>

                {/* Search box area element */}
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
                            value={localInput}
                            placeholder='Enter Search Here...'
                            onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}  // triggers search when ENTER pressed
                        />
                    <button type='button' onClick={handleSubmit}>🔍</button>
                </div>

            {/* Wraps both menu-slider and clear-search buttons */}
            <div className='buttons-wrapper'>
                <button 
                    className='clear-search' 
                    type='button' 
                    onClick={handleClear}
                >
                Clear
                </button>
            </div>
        </div>
    );
};

export default SearchHeader;