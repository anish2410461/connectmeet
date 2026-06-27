const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ConnectMeet API Running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;
