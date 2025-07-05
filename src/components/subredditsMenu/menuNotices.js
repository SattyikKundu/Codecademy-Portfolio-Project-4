import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader} from "react-spinners";
import './subredditsMenu.css';

export const SubRedditsErrorNotice = ({error}) => { // component for error notice in SubReddits menu
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
        {' '}Error is: <span style={{color:'red'}}>{error}</span>
      </h2>
      <span>If error fetching Subreddits menu, you likely need to wait 5-10 minutes to reload page since Reddit API limits number of fetches at a time.</span>
    </div>
  );
}

export const SubRedditsLoadingNotice = () => { // component for loading notice in SubReddits menu
    return(
      <div className="subReddits-loading-notice">
        <h2>Loading Subreddits menu...</h2>
        <ClipLoader size={160} color={'#0c4b8c'} />
      </div>
    );
}