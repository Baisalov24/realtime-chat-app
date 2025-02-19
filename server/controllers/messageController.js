import Message from "../models/MessageModel.js";
import Chat from "../models/ChatModel.js";

/**
 * @desc send message
 * @route POST /api/messages
 * @access Private
 */
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Message content is required" });
  }

  try {
    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      content,
    });

    
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc get all messages
 * @route GET /api/messages/:chatId
 * @access Private
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "username email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
