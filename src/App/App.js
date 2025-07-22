import { useEffect } from "react";
import { useState } from "react";

import SearchHeader from "../components/searchHeader/searchHeader.js";
import SubRedditsMenu from "../components/subredditsMenu/subredditsMenu.js";
import PostsBody from "../components/postsBody/postsBody.js";

import './App.css';

const App = () => {

    const [subRedditUrl, setSubRedditUrl] = useState(''); // tracks and stores current subReddit and its url
    const [subPermalink, setSubPermalink] = useState(''); // used to track curren subReddit's permalink.
    const [isMenuOpened, setIsMenuOpened] = useState(true); // tracks if subReddits side-menu is opened or closed.


    useEffect(()=>{ // used to close subReddits menu by default on <768px width
      
      const handleMenuResize = () => {
        /*  subReddits menu starts of closed at <768px width. 
         *  warning: this will trigger on any resize, not just
         *  when the width changes from above to below 768px.
         */
        (window.innerWidth < 768) ? setIsMenuOpened(false) : setIsMenuOpened(true);
      }

      /* Window event listener attaches method to a windows-defined browser 
       * event 'resize', which refers to any windows resize. Basically, 
       * handleMenuResize() runs whenever there's any windows resize. 
       */
      window.addEventListener('resize', handleMenuResize);

      handleMenuResize(); // run once on mount

      /* removes event listener when component unmounts 
         since we don't want it running afterwards */
      return () => window.removeEventListener("resize", handleMenuResize); 

    },[]) // runs once on mount



    return(
        <>
        <div className="top">
            <SearchHeader 
              subPermalink   ={subPermalink}  // used by search bar header to show current subReddit.

              isMenuOpened   ={isMenuOpened}  // varaible and method used for toggling menu to open or close.
              setIsMenuOpened={setIsMenuOpened}
            />
        </div>
        <div className="menu-plus-posts">
          <SubRedditsMenu 
            setSubRedditUrl={setSubRedditUrl} // used to set subReddit selection(subRedditUrl), 
                                              // which is then used in <PostsBody> below.

            setSubPermalink={setSubPermalink} // Sets current subReddit's permalink to display on <SearchHeader> above
            isMenuOpened   ={isMenuOpened}    // used to track whether menu is opened of closed.
          />
          <PostsBody subRedditUrl={subRedditUrl} />
        </div>
        </>
    );
}

export default App;