'use client'
import classes from './videoplayer.module.css';
import ReactPlayer from 'react-player';


const VideoPlayer = ({ url, options }) => {
    if (!url) return null;

    return (
        <div className={classes.customVideoWrapper}>
            <ReactPlayer
                url={url}
                controls={true}
                width='100%'
                height='100%'
                {...options}
            />
        </div>
    );
};

export default VideoPlayer;
