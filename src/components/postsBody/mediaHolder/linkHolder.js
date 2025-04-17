import React from "react";

import './mediaHolder.css';

//export const LinkHolder = ({props}) => { // Pass video url so it can be rendered

export const LinkHolder = ({linkPreview}) => {

    //const {postType, link} = props; // extract from props
//    const {linkPreview} = props; // extract from props

//    const openUrl = (linkUrl) => { window.open(linkUrl.String(), '_blank')}

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
                <div className="link-button">
                <a href={linkPreview.url} target="_blank" rel="noopener noreferrer">Open</a>
                </div>
            </div>
        </div>
    )


}

export default LinkHolder;