

// 
export function timeAgo(unixTime) { // function converts unitTime (seconds) into 
    const seconds = Math.floor(Date.now() / 1000) - unixTime;
  
    if (seconds < 60){ // If under 60, return 'seconds ago'
        return `${seconds} seconds ago`;
    } 

    const minutes = Math.floor(seconds / 60); // convert and floor seconds to minutes
    if (minutes < 60) { // return 'minute(s) ago'
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } 

    const hours = Math.floor(minutes / 60); // convert and floor minutes to hours
    if (hours < 24) { // return 'hour(s) ago'
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;  
    }

    const days = Math.floor(hours / 24); // convert and floor hours to days
    if (days < 7){ // return 'day(s) ago'
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } 

    const weeks = Math.floor(days / 7); // convert and floor days to weeks
    if (weeks < 4) { //return 'week(s) ago'
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }
        
    const months = Math.floor(days / 30); // convert and floor days to months
    if (months < 12){ // return 'month(s) ago'
        return `${months} month${months === 1 ? '' : 's'} ago`;
    } 

    const years = Math.floor(days / 365); // Otherwise, convert and floor days to years
    return  `${years} year${years === 1 ? '' : 's'} ago`; // return 'year(s) ago'
    
}