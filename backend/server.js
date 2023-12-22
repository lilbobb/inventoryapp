require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")



// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Routes middleware
app.use("/api/users", userRoute);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Error Middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
