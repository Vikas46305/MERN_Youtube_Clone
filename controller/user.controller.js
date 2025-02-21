import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const App = express();

import user from "../model/user.model.js";
import CheckAuth from "../middleware/isAuth.js";

// Signup API
App.post("/signup", async (req, res) => {
    try {
        const { channelName, email, phone, password } = req.body;
        console.log(channelName, email, phone, password);
        if (!channelName || !email || !phone || !password) {
            return res.status(404).json({
                message: "All fields are required",
                success: false,
            });
        }

        //  Check email already exist or not
        const CheckEmail = await user.findOne({ email });
        if (CheckEmail) {
            return res.status(400).json({
                message: "Email already exist",
                success: false,
            });
        }

        // Hash Password
        const HashPassword = await bcrypt.hash(password, 10);

        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            req.files.logo.tempFilePath
        );

        const NewUser = user({
            channelName,
            email,
            phone,
            password: HashPassword,
            logoUrl: uploadResult.secure_url,
            logoId: uploadResult.public_id,
        });
        await NewUser.save();

        res.status(201).json({
            message: "user created successfully !",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Login Api
App.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check Email & Password field
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check email exist or not
        const FindEmail = await user.findOne({ email });
        if (!FindEmail) {
            return res.status(400).json({
                message: "Invalid email",
                success: false,
            });
        }

        // VerifyPassword
        const VerifyPassword = await bcrypt.compare(
            password,
            FindEmail.password
        );

        // Check password match or not
        if (!VerifyPassword) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            });
        }

        // Sign Token here
        const Token = jwt.sign(
            { Token: FindEmail._id },
            process.env.jwtSecrateKey,
            {
                expiresIn: 24 * 60 * 60 * 3600,
            }
        );

        // Set a cookie here
        res.cookie("Token", Token, {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        })
            .status(200)
            .json({
                message: `Welcome ${FindEmail.channelName}`,
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

// Logout Api
App.get("/logout", CheckAuth, (req, res) => {
    res.clearCookie("Token", "", { expiresIn: 0 }).status(200).json({
        message: "Logout success",
    });
});

// Subsribe API
App.post("/subscribe/:id", CheckAuth, async (req, res) => {
    try {
        const FindUser = await user.findById(req.params.id);
        if (!FindUser) {
            return res.status(404).json({
                message: "No user found",
                success: false,
            });
        }
        if (FindUser.subscribeBy.includes(req.userId)) {
            return res.status(400).json({
                message: "Already subscribe",
                success: false,
            });
        } else {
            FindUser.subscribeBy.push(req.userId);
            FindUser.subscribers += 1;
            FindUser.save();
            res.status(200).json({
                message: "Done",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// UnSubsribe API
App.post("/unsubscribe/:id", CheckAuth, async (req, res) => {
    try {
        const FindUser = await user.findById(req.params.id);
        if (!FindUser) {
            return res.status(404).json({
                message: "No user found",
                success: false,
            });
        }
        if (FindUser.subscribeBy.includes(req.userId)) {
            FindUser.subscribeBy.pop(req.userId);
            FindUser.subscribers -= 1;
            FindUser.save();
            res.status(200).json({
                message: "Done",
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "not subscribe",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

export default App;
