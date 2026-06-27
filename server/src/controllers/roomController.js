const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

const createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      roomId: uuidv4(),
      host: req.user.id,
      participants: [req.user.id]
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.participants.includes(req.user.id)) {
      room.participants.push(req.user.id);
      await room.save();
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate("host", "username email")
      .populate("participants", "username email");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoom
};
