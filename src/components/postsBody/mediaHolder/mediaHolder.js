import React from "react";
import { useEffect } from "react"; // enable creating 'side-effects'
import { useRef } from "react";    // .....
import { useState } from "react";  // tracks and manages local component states 
import * as dashjs from "dashjs";  // import 'dashjs' library as object in order to handle 
                                   // .mpd video clips, which contain BOTH video and audio.

import './mediaHolder.css';

export const VideoHolder = ({video}) => { // Pass video url so it can be rendered

    const videoRef = useRef(null);  // Created mutable reference to <video> element in DOM.
                                    // React will assign  <video> element  to 'videoRef.current' 
                                    // via ref={videoRef} in <video> AFTER rendering.


    const [vidheight, setVidHeight] = useState(0); // Get and set max height of video 

    useEffect(() => {
        const setMax = () => { // 1st, get and set max height of video
        if(video && video.height ){
                const vidHeight = video.height;
                setVidHeight(vidHeight < 500 ? vidHeight: 500); //save calculated max only if under 500px
        }}
        setMax();

        if (!videoRef.current || !video) return; // If no videoRef or video data, stop useEffect early

        const player = dashjs.MediaPlayer().create(); // Creates dash.js media player instance

        player.initialize(videoRef.current, video.dashUrl, false); 
        /* ABOVE:
           - By now, videoRef.current should refer to <video ref={videoRef}> below 
             and binds the <video> DOM element to 'player'
           - 'video.dashUrl' is the video's sourc url accessed by player (the .mpd contains sound + video)
           - 'false' prevent autoplay of <video> on render.  
        */
        player.setAutoPlay(false); // Explicitly disables autoplay (redundant but safe)
        
        return () => { 
            /* React looks for specific keyword 'return' as function to execute
               before unmounting for next component render. Clean-up function runs 
               on component unmount */
            player?.reset();
        };
    },[video])

    return (
     <>
     <div 
       className="video-container" 
       style={{ 
        display: vidheight === 0 ? 'none': 'block'  // gets rid of display if no height (no awkward space)
      }}
     >
        <video 
            className='post-vid'
            ref={videoRef}  // Tells React to "assign this <video> to 'videoRef.current' from earlier
            width={video.width}
            height={video.height}
            controls
        ></video>
     </div>
     </>
    );
}

export const ImageHolder = ({images}) => {

    /* If multiple images are provided via props, they will be presented as a carousel */
    const [index, setIndex] = useState(0); // stores index value of images array
    const arrayLength = images.length;     // size of passed array

    const clickNext = () => { // handles clicking 'next' on carousel
        (index+1 < arrayLength) ? setIndex(index+1) : setIndex(0);
    }
    const clickPrev = () => { // handles clicking 'prev' on carousel
        (index-1 > -1) ? setIndex(index-1) : setIndex(arrayLength-1);
    }

    /* Used to get and store the max-height of all images in array.
       Used to help keep image slider at consistent size! */
    const [maxheight, setMaxHeight] = useState(0); //default 0px height for empty image(s)

    useEffect(() => {
        const getMax = () => { // get the max height out of all images
            if(images && images.length >0 ){
                const max = Math.max(...images.map((image) => image.height)); // get max-height from all images 
                setMaxHeight(max < 500 ? max: 500); //save calculated max only if under 500px
            }
        }
        getMax();
    },[images]) // getMax() runs when images mounts/re-mounts


    return ( // returns image-holding component
       <>
       <div 
          className={  // If multiple-images, use 'images-container' class, otherwise 'image-container' for single image
            (images && images.length>1) ? 'images-container': 'image-container'
          }
          style={{
            height:( // If multiple images, set maxheight, otherwise single image auto-scales height (with width:100%)
                (images.length > 1 && maxheight > 0) ? `${maxheight}px` : 'auto'
            ),
            display: (
                maxheight === 0 ? 'none': 'block'  // gets rid of display if no height (no awkward white space)
            ) 
        }}
       >
       {images && images.length > 0 && images[index] && images[index].url && ( // Checks if image(s) available before rending
            <img 
                key={images[index].id} // when key changes (as result of image 'src' changing due to prev/next buttons), 
                                       // <img> re-renders triggering fade effect from 'fade' class.
                src={images[index].url} 
                alt={`Image #${index}`} 
                className="post-image fade"
                /> 
            )}
            {
                /* If 'images' contain more than 1 image, add prev/next buttons to 
                   navigate images, and show indicator orbs as well */
                (images.length > 1) && (
                <>
                    <div className="prev" onClick={clickPrev} >&#10094;</div>
                    <div className="next" onClick={clickNext} >&#10095;</div>
                    <div className="orbs">
                        {
                            images.map((_, indx) => ( // create a designated 'orb' for each image
                                <div 
                                    key={indx} 
                                    className={index===indx ? "orb-active": "orb"} 
                                    onClick={()=> setIndex(indx)}
                                />
                            ))
                        }
                    </div>
                 </>
                )
        }
       </div>
       </>
    );
}


