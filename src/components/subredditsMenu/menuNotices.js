
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCircleUp, faCircleDown, faMessage, faBan, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import './subredditsMenu.css';

export const subRedditsErrorNotice = ({error}) => { // component for error notice in SubReddits menu

  return (
    <div className="subReddits-error-notice">
      <h2>
        <FontAwesomeIcon 
            icon={faCircleExclamation} 
            style={{color:'red', 
                    border: '1.5px solid black', 
                    borderRadius: '50px'
            }}
        />
        {' '}Error is: {error}
      </h2>
      <span>If you're unable to fetch subReddits list for menu, you likely need to wait 10-15 minutes to reload page since Reddit API limits number of fetches at a time.</span>
    </div>
  );
}

export const subRedditsLoadingNotice = () => {

    
}