import mongoose from "mongoose";

const commentModel = mongoose.Schema(
    {
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video",
        },
        comment: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.model("comment", commentModel);
