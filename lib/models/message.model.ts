import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        ref: 'User'
    },
    recipient: {
        type: String,
        ref: 'User'
    },
    text: String,
    file: String,
}, {
    timestamps: true
});

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;