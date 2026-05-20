import {
  generateResponse,
  generateChatTitle,
} from "../services/ai.service.js";

import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null,
    chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });

  const result = await generateResponse(messages);

  const aiMessages = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  console.log(messages);

  res.status(201).json({
    title,
    chat,
    aiMessages,
  });
}

export async function getChats(req, res) {
  const user = req.user.id;

  const chats = await chatModel.find({ user: user._id });

  res.status(200).json({
    message: "Chats retrieved successfully",
    user,
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user._id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({ chat: chatId }).populate("chat"); // optional: populate chat details

  res.status(200).json({
    message: "Messages retrieved successfully",
    chat,
    messages,
  });
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({  // fix: findOneAndDelete
            _id: chatId,
            user: req.user._id  // fix: _id not id
        });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        await messageModel.deleteMany({  // moved after chat check
            chat: chatId,
        });

        res.status(200).json({
            message: "Chat deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}
