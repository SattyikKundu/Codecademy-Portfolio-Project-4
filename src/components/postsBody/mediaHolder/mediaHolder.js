import React, { useLayoutEffect } from "react";
import { useEffect } from "react"; // enable creating 'side-effects'
import { useRef } from "react";    // .....
import { useState } from "react";  // tracks and manages local component states 
import * as dashjs from "dashjs";  // import 'dashjs' library as object in order to handle 
                                   // .mpd video clips, which contain BOTH video and audio.

import './mediaHolder.css';

export const VideoHolder = ({video}) => { // Pass video url so it can be rendered

    const videoRef = useRef(null);  // Created mutable reference to <video> element in DOM.
                                    // React will assign  <video> element  to 'videoRef.current' 
                                    // via ref={videoRef} in <video> right before rendering.


    useEffect(() => {
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
       display: video.height? 'block' : 'none', // gets rid of display if no height (no awkward blank space)
      }}
     >
        <video 
            className='post-vid'
            ref={videoRef}     // Tells React to "assign this <video> to 'videoRef.current' from earlier
            width={video.width}  /* Default width and height of video provided, but fits and scales to parent 
                                  //  .video-container class due to max-width & max-height of 100% in .post-vid class 
                                  //  in mediaHolder.css. */
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
    const arrayLength = images.length;     // size of passed images array
    
    // handles clicking 'next' on carousel
    const clickNext = () => {  (index+1 < arrayLength) ? setIndex(index+1) : setIndex(0); }

    // handles clicking 'prev' on carousel
    const clickPrev = () => { (index-1 > -1) ? setIndex(index-1) : setIndex(arrayLength-1); }

    /* Used to get and store the max-height of all images in array.
       Used to help keep image slider at consistent size! */

    /* Local states to keep track of with default values */
    const [maxHeight, setMaxHeight] = useState(500);      // Set max height of image(s) to fit container
    const [displayValue, setDisplayValue] = useState(''); // Set display visiblity if there are OR aren't any images  
    const [aspectratio, setAspectRatio] = useState(1);    // Sets aspect ratio of container to maintain carousel container's shape
    const [carousel, setCarousel] = useState(false);      // Tracks if images array is a carousel (multiple images) or not (single image)

    const containerRef = useRef(null); // References to image(s) container <div> class element in DOM.
                                       // React will assign containerRef to <div> element with
                                       // ref={containerRef} after DOM set and right before rendering.
    useEffect(() => {

        /*First, determine display property value based on # of images */
        if (!images || images===null | images.length===0) {
            setDisplayValue('none');
            return;
        }
        if (images && images.length>0) {
            setDisplayValue('flex');
        }


        if(images && images.length >1 ){ // If 'images' has multiple images...

                setCarousel(true); // sets carousel to true
                const validHeights = images.map(img => img.height).filter(Boolean); // filters out all falsy/invalid image heights

                const max = Math.max(...validHeights); // gets max. out of all heights
                setMaxHeight(max < 500 ? max: 500);    //save calculated max if under 500px

                const containerWidth = containerRef.current?.clientWidth || 0; // gets container width
                setAspectRatio(containerWidth/maxHeight);   // sets width-height aspect ratio
        }
        else if(images && images.length===1 ){ // If 'images' has only 1 post image...
                setCarousel(false); // carousel is false

                const imgHeight = images[0].height; // image's height
                const imgWidth  = images[0].width;  // image's width
                const containerWidth = containerRef.current?.clientWidth || 0; // gets container's width via containerRef

                if (imgHeight > imgWidth) { // if img height > width, it's a 'tall' image 
                    setMaxHeight(500);      // prevent image from going past 500px height 
                    //setAspectRatio(containerWidth/maxHeight); // aspect ratio to keep container shape
                }
                if( imgWidth >= imgHeight){ 
                    /* if 'horizontal' image, adjust max-height to avoid extra 
                       container space if scaled down hieght is under 500px. */
                    const aspect = imgHeight/imgWidth;
                    const scaledHeight = aspect * containerWidth;
                    setMaxHeight(scaledHeight < 500 ? scaledHeight: 500);
                    //setAspectRatio(containerWidth/scaledHeight);
                }
        }

    },[images]);  // remounts when images change/renew.


    return ( // returns image-holding component
       <>
       <div 
          className={  // If multiple-images, use 'images-container' class, otherwise 'image-container' for single image
            //(images && images.length>1) ? 'images-container': 'image-container'
            carousel ? 'images-container': 'image-container' // Get class depending on if images is multi-image or not
          }
          ref={containerRef} // connect container <div> to useRef
          style={{
            maxHeight: `${maxHeight}px`, // defined max-hieght of container
            display: `${displayValue}`, //  should be 'none' (if no images) or 'flex'
            aspectRatio: (carousel && aspectratio) // Use aspect ratio only if carousel
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
                            images.map((_, indx) => ( // creates a designated 'orb' for each image
                                <div 
                                    key={indx} 
                                    className={index===indx ? "orb-active": "orb"} 
                                    onClick={()=> setIndex(indx)} // clicking orb get corresponding image
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