import express from "express";
import { v2 as cloudinary } from "cloudinary";
import CheckAuth from "../middleware/isAuth.js";
import videoModel from "../model/video.model.js";

const App = express();

// Upload video API
App.post("/upload", CheckAuth, async (req, res) => {
    try {
        const { title, description, category, tags } = req.body;
        //  Check all field are empty or not
        if (!title || !description || !category || !tags) {
            return res.status(404).json({
                message: "All field are required",
                success: false,
            });
        }

        // Convert Tags String to array
        const TagsArray = await tags.split(",");

        // Upload file here
        const UploadVideo = await cloudinary.uploader.upload(
            req.files.video.tempFilePath,
            {
                resource_type: "video", // Set the resource type to video
                allowed_formats: ["mp4", "mov", "avi"], // Allowed video formats
                max_file_size: 500 * 1024 * 1024, // Max file size (500MB)
            }
        );
        const UploadThumbnail = await cloudinary.uploader.upload(
            req.files.thumbnail.tempFilePath
        );

        // Store data in database
        const NewVideoModel = videoModel({
            title,
            description,
            category,
            tags: TagsArray,
            userId: req.userId,
            videoUrl: UploadVideo.secure_url,
            videoId: UploadVideo.public_id,
            thumbnailUrl: UploadThumbnail.secure_url,
            thumbnailId: UploadThumbnail.public_id,
        });
        await NewVideoModel.save();

        // Return success message here
        res.status(200).json({
            message: "Video upload success",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Update video API
App.put("/update/:id", CheckAuth, async (req, res) => {
    try {
        const { title, description, category, tags } = req.body;

        // Check user is correct or not
        const FindCourseAndCheck = await videoModel.findById(req.params.id);
        if (FindCourseAndCheck.userId !== req.userId) {
            return res.status(400).json({
                message: "You don't have access",
                success: false,
            });
        }

        // Update Data
        const FindCourse = await videoModel.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                tags,
            },
            { new: true }
        );
        res.status(200).json({
            message: "Update success",
            success: true,
            data: FindCourse,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Delete API
App.delete("/:id", CheckAuth, async (req, res) => {
    try {
        const FindVideo = await videoModel.findOne({ _id: req.params.id });

        if (FindVideo.userId !== req.userId) {
            return res.status(400).json({
                message: "You don't have access",
                success: false,
            });
        }

        // Delete data from cloudinary
        await cloudinary.uploader.destroy(FindVideo.videoId);
        await cloudinary.uploader.destroy(FindVideo.thumbnailId);

        await videoModel.findByIdAndDelete({
            _id: req.params.id,
        });

        res.status(200).json({
            message: "Video deleted successfully !",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

//  Like By API
App.post("/like/:id", CheckAuth, async (req, res) => {
    try {
        const FindVideo = await videoModel.findById(req.params.id);
        if (!FindVideo) {
            return res.status(400).json({
                message: "No video found",
                success: false,
            });
        }
        if (FindVideo.LikedBy.includes(req.userId)) {
            return res.status(400).json({
                message: "Already liked",
                success: false,
            });
        } else {
            FindVideo.LikedBy.push(req.userId);
            FindVideo.likes += 1;
            FindVideo.save();
            res.status(200).json({
                message: "like",
                success: true,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Disliked by
App.post("/dislike/:id", CheckAuth, async (req, res) => {
    try {
        const FindVideo = await videoModel.findById(req.params.id);
        if (!FindVideo) {
            return res.status(400).json({
                message: "No video found",
                success: false,
            });
        }
        if (FindVideo.LikedBy.includes(req.userId)) {
            FindVideo.LikedBy.pop(req.userId);
            FindVideo.likes -= 1;
            FindVideo.save();
            res.status(200).json({
                message: "you dislike this video",
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "Already disliked",
                success: false,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Views API
App.get("/views/:id", async (req, res) => {
    try {
        const FindVideo = await videoModel.findById(req.params.id);
        FindVideo.views += 1;
        FindVideo.save();
        res.status(200).json({
            message: "Done",
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
