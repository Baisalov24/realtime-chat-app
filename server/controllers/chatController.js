import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

/**
 * @desc 
 * @route
 * @access
 */
export const createChat = async (req, res) => {
  const { userId } = req.body; 

  try {
    
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, userId],
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc 
 * @route 
 * @access 
 */
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id }).populate(
      "participants",
      "-password"
    );

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
