"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Message from "../models/message.model";

interface Params {
    sender: string,
    recipient: string,
    text: string,
    file: string, // Assuming file is optional, adjust if needed
    path: string,
}

export async function createMessage({ sender, recipient, text, file, path }: Params) {
    try {
        connectToDB();

        const createdMessage = await Message.create({
            sender,
            recipient,
            text: text.replace(/\n/g, '\r\n'), // Store the text as a multiline string
            file: file, // Store file or null if not provided
        });

        // Update User model for the sender and recipient
        // await User.updateMany(
        //     { _id: { $in: [sender, recipient] } },
        //     { $push: { messages: createdMessage._id } }
        // );


        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Failed to create message: ${error.message}`);
    }
}

export async function fetchMessagesBetweenUsers(userId: string, otherUserId: string) {
    try {
        connectToDB();

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId },
            ],
        });

        return messages;
    } catch (error: any) {
        throw new Error(`Failed to fetch messages: ${error.message}`);
    }

}