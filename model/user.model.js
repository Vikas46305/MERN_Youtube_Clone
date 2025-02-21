import mongoose from "mongoose";

const userModel = mongoose.Schema(
    {
        channelName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: Number,
        },
        password: {
            type: String,
            required: true,
        },
        logoUrl: {
            type: String,
            default:
                "https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-youtube-circle-512.png",
        },
        logoId: {
            type: String,
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        subscribeBy:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }],
        subscribedChannels: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("user", userModel);
