
import classes from './propertyvideo.module.css';
import VideoPlayer from "../../videoplayer/videoplayer";
const PropertyVideo = async ({ video }) => {
    console.log(video)
    return (<div className={classes.container}>
        <h1 className={classes.header}>فيديو العقار</h1>
        {video && <VideoPlayer
            url={video}
            options={{
                playing: false,
                loop: false,
                muted: false
            }} />}
        {!video && <p>لا يوجد فيديو لهذا العقار</p>}
    </div>)

}

export default PropertyVideo;