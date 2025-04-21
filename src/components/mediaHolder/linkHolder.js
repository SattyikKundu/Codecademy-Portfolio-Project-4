import React from "react";

import './stylesHolder.css';

export const LinkHolder = ({linkPreview}) => {  // Pass linkPreview object so it can be rendered
 
    return (
        <div className="link-container">
            <div className="link-preview">
            <img 
                src={linkPreview.thumbUrl} 
                alt={`Link Title: ${linkPreview.title}`} 
                className="link-thumbnail"
                /> 
            </div>
            <div className="link-box">
                <div className="link-domain">
                    {linkPreview.domain}
                </div>
                <a className="link-button" 
                     href={linkPreview.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                >
                    Open
                </a>
            </div>
        </div>
    )
}

export default LinkHolder;