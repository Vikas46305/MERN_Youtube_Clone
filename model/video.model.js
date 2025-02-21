import mongoose from "mongoose";

const VideoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        videoId: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            required: true,
        },
        thumbnailId: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
            },
        ],
        likes: {
            type: Number,
            default: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
        },
        LikedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        disLikedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        viewdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.model("video", VideoSchema);
