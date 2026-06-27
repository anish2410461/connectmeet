const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL,
  ],
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
