require("dotenv").config(); // must be first

const express = require("express");
const http = require("http");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

const userRouter = require("./routes/userRoutes");
const vehicleRouter = require("./routes/vehicleRoutes");
const chatRouter = require("./routes/chatRoutes");
const adminRouter = require("./routes/adminRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const ratingRouter = require("./routes/ratingRoutes");

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use("/api/", apiLimiter);

app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ratings", ratingRouter);

app.get("/api/test", (req, res) => {
  res.send("VehicleHub API is working!");
});

connectDB();

const httpServer = http.createServer(app);
initSocket(httpServer, corsOptions);

const PORT = process.env.PORT || 8082;
httpServer.listen(PORT, () => {
  console.log(`VehicleHub server running at port: ${PORT}`);
});
