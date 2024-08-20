const Conversation = require("../model/conversation.model");
const Message = require("../model/message.model");

async function sendMessage(req, res) {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: { senderId, receiverId } },
    });

    // establish the convo if not started
    if (!conversation)
      conversation = await Conversation.create({
        participants: { $all: { senderId, receiverId } },
      });

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // implmemtn socket io for real time data transfer
    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

async function getMessage(req, res) {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const conversation = await Conversation.find({
      participants: { $all: { senderId, recieverId } },
    });
    if (!conversation)
      return res.status(200).json({ messages: [], success: true });

    return res
      .status(200)
      .json({ messages: conversation?.messages, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}
