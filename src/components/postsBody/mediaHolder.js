import React, { useEffect } from "react";
import { useState } from "react";

import './mediaHolder.css';

export const VideoHolder = ({video}) => { // Pass video url so it can be rendered
    return (
     <>
     <div className="video-container">
        <video className='post-vid' width={video.width} height={video.height} controls>
            <source src={video.vidUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
     </div>
     </>
    );
}

export const ImageHolder = ({images}) => {

    /* If multiple images are provided via props, they will be presented as a carousel */
    const [index, setIndex] = useState(0); // stores index value of images array
    const arrayLength = images.length;     // size of passed array

    const clickNext = () => { // handles clicking on next
        (index+1 < arrayLength) ? setIndex(index+1) : setIndex(0);
    }
    const clickPrev = () => { // handles clicking on previous
        (index-1 > -1) ? setIndex(index-1) : setIndex(arrayLength-1);
    }

    /* Used to get and store the max-height of all images in array.
       Used to help keep image slider at consistent size */
    const [maxheight, setMaxHeight] = useState(0); //default 0px height, especially for empty images

    useEffect(() => {
        const getMax = () => { // get the max height out of all images
            if(images && images.length >0 ){
                const max = Math.max(...images.map((image) => image.height)); // get max-height from all images 
                setMaxHeight(max < 500 ? max: 500); //save calculated max only if under 500px
            }
        }
        getMax();
    },[images])

    return (
       <>
       <div 
          className={(images && images.length ===1) ? 'image-container' : 'images-container'}
          style={{height:`${maxheight}px`}}
       >
       {images && images.length > 0 && images[index] && images[index].url && ( // First checks if image(s) available...
            <img 
                key={images[index].id} // when key changes, <img> re-renders triggering fade effect from 'fade' class
                src={images[index].url} 
                alt={`Image #${index}`} 
                className="post-image fade"
                /> 
            )}
            {
                /* If more than 1 image, add prev/next buttons to 
                   navigate images, and show indicator orbs as well */
                (images.length > 1) && (
                <>
                    <div className="prev" onClick={clickPrev} >&#10094;</div>
                    <div className="next" onClick={clickNext} >&#10095;</div>
                    <div className="orbs">
                        {
                            images.map((_, indx) => (
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


