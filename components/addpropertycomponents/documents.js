// 'use client';
// import { Fragment, useEffect, useState } from "react";
// import classes from './documents.module.css';
// import { Readex_Pro } from "next/font/google";
// import VideoPlayer from "../videoplayer/videoplayer";
// import 'plyr/dist/plyr.css';

// const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });

// const Documents = (props) => {
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [cimagePreviews, setCimagePreviews] = useState([]);
//     const [videoPreview, setVideoPreview] = useState(null);


//     const handleImageUpload = (event) => {
//         const files = Array.from((event.target && event.target.files) || (event.dataTransfer && event.dataTransfer.files) || []);
//         if (files.length === 0) return;
   
//         props.dispatch({ type: 'ADD_IMAGE', images: files });
//     };

//     const handleConstraintImageUpload = (event) => {
//         const files = Array.from((event.target && event.target.files) || (event.dataTransfer && event.dataTransfer.files) || []);
//         if (files.length === 0) return;
//         props.dispatch({ type: 'ADD_CIMAGE', cimages: files });
//     };

//     const handleVideoUpload = (event) => {
//         const file = (event.target && event.target.files && event.target.files[0]) || (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]);
//         if (!file) return;
//         props.dispatch({ type: 'ADD_VIDEO', video: file });
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         handleImageUpload(e);
//     };
//     const handleVideoDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         handleVideoUpload(e);
//     };
//     const handlecimageDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         handleConstraintImageUpload(e);
//     };

  
//     useEffect(() => {
   
//         const urls = props.state.images.map(item => {
//             if (!item) return null;
//             if (item instanceof File) {
//                 return URL.createObjectURL(item);
//             }
    
//             return item;
//         });

 
//         setImagePreviews(prev => {
        
//             prev.forEach(u => {
//                 try {
//                     if (u && u.startsWith('blob:')) URL.revokeObjectURL(u);
//                 } catch (e) { }
//             });
//             return urls;
//         });


//         return () => {
//             urls.forEach(u => {
//                 try {
//                     if (u && u.startsWith('blob:')) URL.revokeObjectURL(u);
//                 } catch (e) { }
//             });
//         };

//     }, [props.state.images]);

//     useEffect(() => {
//         const urls = props.state.cimages.map(item => {
//             if (!item) return null;
//             if (item instanceof File) return URL.createObjectURL(item);
//             return item;
//         });

//         setCimagePreviews(prev => {
//             prev.forEach(u => {
//                 try {
//                     if (u && u.startsWith('blob:')) URL.revokeObjectURL(u);
//                 } catch (e) { }
//             });
//             return urls;
//         });

//         return () => {
//             urls.forEach(u => {
//                 try {
//                     if (u && u.startsWith('blob:')) URL.revokeObjectURL(u);
//                 } catch (e) { }
//             });
//         };

//     }, [props.state.cimages]);

//     useEffect(() => {
//         if (!props.state.video) {
  
//             setVideoPreview(null);
//             return;
//         }
//         if (props.state.video instanceof File) {
//             const vUrl = URL.createObjectURL(props.state.video);
//             // revoke previous if any
//             if (videoPreview && videoPreview.startsWith('blob:')) {
//                 try { URL.revokeObjectURL(videoPreview); } catch (e) { }
//             }
//             setVideoPreview(vUrl);
//             return () => {
//                 try { URL.revokeObjectURL(vUrl); } catch (e) { }
//             };
//         } else {
      
//             setVideoPreview(props.state.video);
//         }
    
//     }, [props.state.video]);

//     return (
//         <Fragment>
//             <div className={`${classes.documents} ${Readex_Pro_Font.className}`}>
//                 <div
//                     className={classes.uploadContainer}
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                 >
//                     <label htmlFor="imageUpload" className={classes.label}>
//                         <span>اسحب وافلت الصور هنا</span>
//                         <img className={classes.addimg} src="/assets/icons/addimageicon/drag-and-drop.png" alt="إضافة صورة" />
//                         <span>أو اضغط لاختيار الصور</span>
//                     </label>
//                     <input
//                         id="imageUpload"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className={classes.hide}
//                     />
//                 </div>

//                 {imagePreviews.length !== 0 && (
//                     <div className={classes.images}>
//                         {imagePreviews.map((src, index) => (
//                             src ? (
//                                 <img
//                                     className={classes.img}
//                                     key={index}
//                                     src={src}
//                                     alt={`Uploaded ${index + 1}`}
//                                 />
//                             ) : null
//                         ))}
//                     </div>
//                 )}

//                 {props.state.images.length > 0 && (
//                     <button onClick={() => props.dispatch({ type: 'REMOVE_IMAGES' })} className={classes.clearBtn}>
//                         🗑️ إزالة الصور
//                     </button>
//                 )}

//                 <div className={classes.uploadContainer}
//                     onDragOver={handleDragOver}
//                     onDrop={handleVideoDrop}>
//                     <label htmlFor="videoUpload" className={classes.label}>
//                         <span>اسحب وافلت الفيديو هنا</span>
//                         <img className={classes.addimg} src="/assets/icons/addvideoicon/video (3).png" alt="إضافة صورة" />
//                         <span>أو اضغط لاختيار الفيديو</span>
//                     </label>
//                     <input
//                         id="videoUpload"
//                         type="file"
//                         accept="video/*"
//                         onChange={handleVideoUpload}
//                         className={classes.hide}
//                     />
//                 </div>

//                 {videoPreview && (
//                     <div className={classes.videoWrapper}>
//                         <VideoPlayer
//                             sources={{
//                                 type: 'video',
//                                 sources: [
//                                     {
//                                         src: videoPreview,
//                                         type: 'video/mp4',
//                                     },
//                                 ],
//                             }}
//                             options={{
//                                 controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
//                             }}
//                         />
//                     </div>
//                 )}

//                 {props.state.video && (
//                     <button onClick={() => props.dispatch({ type: 'REMOVE_VIDEO' })} className={classes.clearBtn}>
//                         إزالة الفيديو
//                     </button>
//                 )}

//                 <div
//                     className={`${classes.uploadContainer} ${props.validationErrors?.cimages ? classes.inputerror : ''}`}
//                     onDragOver={handleDragOver}
//                     onDrop={handlecimageDrop}
//                 >
//                     <label htmlFor="cimageUpload" className={`${classes.label} `}>
//                         <span>أضف صور اثبات ملكيتك لهذا العقار </span>
//                         <img className={classes.addimg} src="/assets/icons/addimageicon/drag-and-drop.png" alt="إضافة صورة" />
//                         <span>أو اضغط لاختيار الصور</span>
//                     </label>
//                     <input
//                         id="cimageUpload"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleConstraintImageUpload}
//                         className={classes.hide}
//                         required
//                     />
//                 </div>

//                 {cimagePreviews.length !== 0 && (
//                     <div className={classes.images}>
//                         {cimagePreviews.map((src, index) => (
//                             src ? (
//                                 <img
//                                     className={classes.img}
//                                     key={index}
//                                     src={src}
//                                     alt={`Uploaded ${index + 1}`}
//                                 />
//                             ) : null
//                         ))}
//                     </div>
//                 )}

//                 {props.state.cimages.length !== 0 && (
//                     <button onClick={() => props.dispatch({ type: 'REMOVE_CIMAGE' })} className={classes.clearBtn}>
//                         🗑️ إزالة الصور
//                     </button>
//                 )}
//             </div>
//         </Fragment>
//     );
// };

// export default Documents;


































// // 'use client';
// // import { Fragment } from "react";
// // import classes from './documents.module.css';
// // import { Readex_Pro } from "next/font/google";
// // import VideoPlayer from "../videoplayer/videoplayer";
// // import 'plyr/dist/plyr.css';


// // const Readex_Pro_Font = Readex_Pro({ subsets: ['arabic'], weight: '400' });

// // const Documents = (props) => {
// //     const handleImageUpload = (event) => {
// //         const files = Array.from(event.target.files || event.dataTransfer.files);
// //         const imageUrls = files.map((file) => URL.createObjectURL(file));
// //         props.dispatch({ type: 'ADD_IMAGE', images: imageUrls });
// //     };
// //     const handleVideoUpload = (event) => {
// //         const file = event.target.files[0];
// //         const videoUrl = URL.createObjectURL(file);
// //         props.dispatch({ type: 'ADD_VIDEO', video: videoUrl });
// //     }
// //     const handleConstraintImageUpload = (event) => {
// //         const files = Array.from(event.target.files || event.dataTransfer.files);
// //         const cimageurl = files.map((file) => { return URL.createObjectURL(file) })
// //         props.dispatch({ type: 'ADD_CIMAGE', cimages: cimageurl });
// //     }
// //     const handleDragOver = (e) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //     };

// //     const handleDrop = (e) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         handleImageUpload(e);
// //     };
// //     const handleVideoDrop = (e) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         const file = e.dataTransfer.files[0];
// //         if (file && file.type.startsWith("video/")) {
// //             const videoUrl = URL.createObjectURL(file);
// //             props.dispatch({ type: 'ADD_VIDEO', video: videoUrl });
// //         }
// //     };
// //     const handlecimageDrop = (e) => {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         handleConstraintImageUpload(e);
// //     }

// //     return (
// //         <Fragment>
// //             <div className={`${classes.documents} ${Readex_Pro_Font.className}`}>
// //                 <div
// //                     className={classes.uploadContainer}
// //                     onDragOver={handleDragOver}
// //                     onDrop={handleDrop}
// //                 >
// //                     <label htmlFor="imageUpload" className={classes.label}>
// //                         <span>اسحب وافلت الصور هنا</span>
// //                         <img className={classes.addimg} src="/assets/icons/addimageicon/drag-and-drop.png" alt="إضافة صورة" />
// //                         <span>أو اضغط لاختيار الصور</span>
// //                     </label>
// //                     <input
// //                         id="imageUpload"
// //                         type="file"
// //                         multiple
// //                         accept="image/*"
// //                         onChange={handleImageUpload}
// //                         className={classes.hide}
// //                     />
// //                 </div>
// //                 {props.state.images.length !== 0 && (
// //                     <div className={classes.images}>
// //                         {props.state.images.map((src, index) => (
// //                             <img
// //                                 className={classes.img}
// //                                 key={index}
// //                                 src={src}
// //                                 alt={`Uploaded ${index + 1}`}

// //                             />
// //                         ))}
// //                     </div>
// //                 )}
// //                 {props.state.images.length > 0 && (
// //                     <button onClick={() => {

// //                         props.dispatch({ type: 'REMOVE_IMAGES' });
// //                     }} className={classes.clearBtn}>
// //                         🗑️ إزالة الصور
// //                     </button>
// //                 )}

// //                 <div className={classes.uploadContainer}
// //                     onDragOver={handleDragOver}
// //                     onDrop={handleVideoDrop}>
// //                     <label htmlFor="videoUpload" className={classes.label}>
// //                         <span>اسحب وافلت الفيديو هنا</span>
// //                         <img className={classes.addimg} src="/assets/icons/addvideoicon/video (3).png" alt="إضافة صورة" />
// //                         <span>أو اضغط لاختيار الفيديو</span>
// //                     </label>
// //                     <input
// //                         id="videoUpload"
// //                         type="file"
// //                         accept="video/*"
// //                         onChange={handleVideoUpload}
// //                         className={classes.hide}
// //                     />
// //                 </div>
// //                 {props.state.video && (
// //                     <div className={classes.videoWrapper}>
// //                         <VideoPlayer
// //                             sources={{
// //                                 type: 'video',
// //                                 sources: [
// //                                     {
// //                                         src: props.state.video,
// //                                         type: 'video/mp4',
// //                                     },
// //                                 ],
// //                             }}
// //                             options={{
// //                                 controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
// //                             }}
// //                         />
// //                     </div>
// //                 )}
// //                 {props.state.video && <button onClick={() => {

// //                     props.dispatch({ type: 'REMOVE_VIDEO' });
// //                 }} className={classes.clearBtn}>إزالة الفيديو</button>}
// //                 <div
// //                     className={`${classes.uploadContainer} ${props.validationErrors?.cimages ? classes.inputerror : ''}`}
// //                     onDragOver={handleDragOver}
// //                     onDrop={handlecimageDrop}
// //                 >
// //                     <label htmlFor="cimageUpload" className={`${classes.label} `}>
// //                         <span>أضف صور اثبات ملكيتك لهذا العقار </span>
// //                         <img className={classes.addimg} src="/assets/icons/addimageicon/drag-and-drop.png" alt="إضافة صورة" />
// //                         <span>أو اضغط لاختيار الصور</span>
// //                     </label>
// //                     <input
// //                         id="cimageUpload"
// //                         type="file"
// //                         multiple
// //                         accept="image/*"
// //                         onChange={handleConstraintImageUpload}
// //                         className={classes.hide}
// //                         required
// //                     />
// //                 </div>
// //                 {props.state.cimages.length !== 0 && <div className={classes.images}>
// //                     {props.state.cimages.map((src, index) => (
// //                         <img
// //                             className={classes.img}
// //                             key={index}
// //                             src={src}
// //                             alt={`Uploaded ${index + 1}`}

// //                         />
// //                     ))}
// //                 </div>}
// //                 {props.state.cimages.length !== 0 && <button onClick={() => {
// //                     props.dispatch({ type: 'REMOVE_CIMAGE' });
// //                 }} className={classes.clearBtn}>
// //                     🗑️ إزالة الصور</button>}
// //             </div>
// //         </Fragment>
// //     );
// // };

// // export default Documents;
