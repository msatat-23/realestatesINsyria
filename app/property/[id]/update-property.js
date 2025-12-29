"use server"

import { increasePropertyViews } from "@/data/property/property-details";
import { addComment, getComments } from "@/data/reviews-and-comments/comments";
import { addReviewRating, getPropertyReviews, getUserReviewRating } from "@/data/reviews-and-comments/reviews";


export const increasePropertyViewsServer = async (id) => {
    const res = await increasePropertyViews(id);
    return res;
};
export const addReviewRatingServer = async (propertyId, rating) => {
    const res = await addReviewRating(propertyId, rating);
    return res;
};
export const getUserReviewRatingServer = async (propertyId) => {
    const res = await getUserReviewRating(propertyId);
    return res;
};
export const getPropertyReviewsServer = async (propertyId) => {
    const res = await getPropertyReviews(propertyId);
    return res;
};
export const addCommentServer = async (propertyId, comment) => {
    const res = await addComment(propertyId, comment);
    return res;
};
export const getCommentsServer = async (propertyId) => {
    const res = await getComments(propertyId);
    return res;
};