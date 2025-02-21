import express from "express";
const App = express();

import CheckAuth from "../middleware/isAuth.js";
import commentModel from "../model/comment.model.js";

//  New Comment
App.post("/new/:id", CheckAuth, async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment) {
            return res.status(404).json({
                message: "Write comment",
                success: false,
            });
        }
        const NewCommentModel = commentModel({
            comment,
            videoId: req.params.id,
            userId: req.userId,
        });
        await NewCommentModel.save();
        res.status(200).json({
            message: "comment done",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

//  All Comment
App.get("/all/:id", async (req, res) => {
    try {
        const FindAllComment = await commentModel
            .find({
                videoId: req.params.id,
            })
            .populate("userId", ("channelName", "logoUrl"));
        res.status(200).json({
            message: "Done",
            success: true,
            data: FindAllComment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

//  Update comment
App.put("/edit/:id", CheckAuth, async (req, res) => {
    try {
        const { comment } = req.body;
        const FindComment = await commentModel.findByIdAndUpdate(
            req.params.id,
            { comment },
            { new: true }
        );
        res.status(200).json({
            message: "Fetch",
            success: true,
            data: FindComment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

//  Delete comment
App.delete("/delete/:id", CheckAuth, async (req, res) => {
    try {
        await commentModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "comment delete",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

export default App;
