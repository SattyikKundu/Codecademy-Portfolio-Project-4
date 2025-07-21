import { useEffect } from "react"; // enable creating 'side-effects'
import { useRef } from "react";    // 
import * as dashjs from "dashjs";  // import 'dashjs' library as object in order to handle 
                                   // .mpd video clips, which contain BOTH video and audio.

import './stylesHolder.css';

export const VideoHolder = ({postType, video}) => { // Pass video url so it can be rendered

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
        {/* Below returns reddit-host video */}
        {(postType==='hosted:video') && (
                <video 
                    //className='post-vid'
                    className='reddit-video'
                    ref={videoRef}     // Tells React to "assign this <video> to 'videoRef.current' from earlier
                    width={video.width}  /* Default width and height of video provided, but fits and scales to parent 
                                        //  .video-container class due to max-width & max-height of 100% in .post-vid class 
                                        //  in mediaHolder.css. */
                    height={video.height}
                    controls
                />
        )}
        {/* Below embeds external video (like YouTube, etc.) */}
        {(postType==='rich:video' && video?.embedHtml) && (
          <div 
          className="embedded-video-wrapper"
          style={{aspectRatio:`${video.width}/${video.height}`}}
          >
              <div 
                className="embedded-video"
                dangerouslySetInnerHTML={{ __html: video.embedHtml }}
             />
          </div>
        )}
     </div>
     </>
    );
}

export default VideoHolder;