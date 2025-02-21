import express from "express";
const App = express.Router();

import userController from "../controller/user.controller.js";
import videoController from "../controller/video.controller.js";
import commentConroller from "../controller/comment.controller.js";

App.use("/user", userController);
App.use("/video", videoController);
App.use("/comment", commentConroller);

export default App;
