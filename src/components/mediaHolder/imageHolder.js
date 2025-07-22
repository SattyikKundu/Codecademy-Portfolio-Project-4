import { useEffect } from "react"; // enable creating 'side-effects'
import { useRef } from "react";    // .....
import { useState } from "react";  // tracks and manages local component states 

import './stylesHolder.css';

export const ImageHolder = ({postType, images}) => {

    /* If multiple images are provided via props, they will be presented as a carousel */
    const [index, setIndex] = useState(0); // stores index value of images array
    const arrayLength = images.length;     // size of passed images array
    
    const clickNext = () => {  // handles clicking 'next' on carousel
        (index+1 < arrayLength) ? setIndex(index+1) : setIndex(0); 
    }

    const clickPrev = () => {  // handles clicking 'prev' on carousel
        (index-1 > -1) ? setIndex(index-1) : setIndex(arrayLength-1); 
    }

    /* Local states to keep track of with default values */
    const [maxHeight, setMaxHeight] = useState(400);//useState(500);      // Set max height of image(s) to fit container
    const [displayValue, setDisplayValue] = useState(''); // Set display visiblity if there are OR aren't any images  
    const [aspectratio, setAspectRatio] = useState(1);    // Sets aspect ratio of container to maintain carousel container's shape

    const containerRef = useRef(null); // References to image(s) container <div> class element in DOM.
                                       // React will assign containerRef to <div> element with
                                       // ref={containerRef} after DOM set and right before rendering.

    useEffect(() => {

        //First, determine display property value based on # of images 
        if (!images || images===null | images.length===0) {
            setDisplayValue('none');
            return;
        }
        else if (images && images.length>0) {
            setDisplayValue('flex');
        }

        // Now set useState values based on post-type
        if(postType==='gallery'){ // If post has gallery of images

                const validHeights = images.map(img => img.height).filter(Boolean); // filters out all falsy/invalid image heights

                const max = Math.max(...validHeights); // gets max. out of all heights
                //setMaxHeight(max < 500 ? max: 500);    
                setMaxHeight(max < 400 ? max: 400);   //save calculated max if under 400px

                const containerWidth = containerRef.current?.clientWidth || 0; // gets container width
                setAspectRatio(containerWidth/maxHeight);   // sets width-height aspect ratio
        }
        else if(postType==='image'){ // If post has only 1 image

                const imgHeight = images[0].height; // image's height
                const imgWidth  = images[0].width;  // image's width
                const containerWidth = containerRef.current?.clientWidth || 0; // gets container's width via containerRef

                if (imgHeight > imgWidth) { // if height > width, it's a 'tall' image 
   
                    //setAspectRatio(containerWidth/maxHeight); // aspect ratio to keep container shape
                    setMaxHeight(400);  // prevent tall image from going past 500px height 
                }
                if(imgWidth >= imgHeight){ 
                    /* if 'horizontal' image, adjust max-height to avoid extra 
                       container space if scaled down hieght is under 500px. */

                    //const aspect = imgHeight/imgWidth;
                    //const scaledHeight = aspect * containerWidth;
                    //setAspectRatio(containerWidth/scaledHeight);

                    //setMaxHeight(scaledHeight < 500 ? scaledHeight: 500);
                    //setMaxHeight(500);
                    setMaxHeight(400);
                }
        }

    },[images]);  // remounts when images change/renew.


    return ( // returns image-holding component
       <>
       <div 
          className={  // If multiple-images, use 'images-container' class, otherwise 'image-container' for single image
            (postType==='gallery') ? 'gallery-container': 'image-container' // Class change based on post type
          }
          ref={containerRef} // connect container <div> to useRef
          style={{
            maxHeight: `${maxHeight}px`, // defined max-hieght of container
            display: `${displayValue}`, //  should be 'none' (if no images) or 'flex'
            aspectRatio: (postType==='gallery') && aspectratio // Use aspect ratio only if gallery
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

export default ImageHolder;