'use client';
import { useEffect, useState } from 'react';
import classes from './comments.module.css';
import { Rating } from 'react-simple-star-rating';
import { useSelector } from 'react-redux';
import { addCommentServer, addReviewRatingServer, getCommentsServer, getUserReviewRatingServer } from '@/app/property/[id]/update-property';
const CommentsSection = ({ id }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [Loading, setLoading] = useState(false);

    const username = useSelector(state => state.user.username);

    const formatDate = (date) => {
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return formattedDate;
    };

    useEffect(() => {
        const fetchrating = async () => {
            try {
                setLoading(true);
                const res = await getUserReviewRatingServer(id);
                const data = await JSON.parse(res.data);
                if (res.ok) {
                    setRating(data.rating);
                }
            } catch (e) {
                console.log('فشل جلب تقييم المستخدم لهذا العقار', e);
            } finally {
                setLoading(false);
            }
        }
        fetchrating();
    }, [id]);

    useEffect(() => {
        const fetchcomments = async () => {
            try {
                setLoading(true);
                const res = await getCommentsServer(id);
                const data = res.data;
                if (res.ok) {
                    setComments(data);
                }
            } catch (e) {
                console.log('فشل جلب التعليقات', e);
            } finally {
                setLoading(false);
            }
        };
        fetchcomments();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) return;
        const now = new Date();
        const timestamp = now.getTime();
        const newComment = {
            id: timestamp,
            comment: text,
            createdAt: now,
            user: { username: username, reviews: [{ rating: rating }] }
        };

        try {
            setLoading(true);
            const res = await addCommentServer(id, text);
            console.log(res);
            if (res.ok) {
                setComments([newComment, ...comments]);
                setText('');
            }
            setLoading(false);
        } catch (e) {
            console.log('فشل التعليق', e);
            setLoading(false);
        }

    };
    const handleClick = (value) => {
        setRating(value);
        console.log(rating);
    };

    const handleStarSubmission = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await addReviewRatingServer(id, rating);
            const data = await JSON.parse(res.data);
            setLoading(false);
        } catch {
            console.log('فشل التقييم');
            setLoading(false);
        }
    }
    return (
        <div className={classes.commentsSection}>
            <h2>💬 التعليقات</h2>

            <div className={classes.commentsList}>
                {comments.length === 0 && (
                    <p className={classes.noComments}>لا توجد تعليقات بعد.</p>
                )}
                {comments.map((comment) => (
                    <div key={comment.id} className={classes.comment}>
                        <div className={classes.commentHeader}>
                            <span className={classes.commentName}>{comment.user.username}</span>
                            <span className={classes.commentDate}>{formatDate(comment.createdAt)}</span>
                        </div>
                        <div className={classes.commentTextContainer}>
                            <p className={classes.commentText}>{comment.comment}</p>
                            <div className={classes.ratingFix}>
                                <Rating
                                    readonly={true}
                                    initialValue={comment.user?.reviews[0]?.rating || 0}
                                    size={24}
                                    fillColor="#ffb71b"
                                    emptyColor="#dbdfe1"
                                    allowFraction
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={classes.commentForm}>
                <textarea
                    placeholder="أضف تعليقك..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={classes.textarea}
                />
                <button type="submit" className={classes.button}>إرسال</button>
            </form>
            <form onSubmit={handleStarSubmission} className={classes.ratingForm}>
                <div className={classes.ratingsection}>
                    <div className={classes.ratingFix}>
                        <Rating
                            size={38}
                            allowFraction
                            fillColor="#ffb71b"
                            emptyColor="#dbdfe1"
                            transition
                            initialValue={rating}
                            onClick={handleClick}
                        />
                    </div>
                    <span className={classes.rating}>{rating}</span>
                </div>
                <input type='submit' value='تقييم' className={`${classes.button} ${classes.block}`} />
            </form>
            {Loading && <div className={classes.overlay}>
                <div className={classes.spinner}></div>
                <p>جار التحميل...</p>
            </div>}
        </div>
    );
};

export default CommentsSection;
