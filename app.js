const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const compress = require("compression");
const connectDB = require("./config/dbConfig");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/AuthRoutes");
const UserOpenRoutes = require("./routes/UsersRoutes");
const UserSecureRoutes = require("./routes/UserSecureRoutes");
const PostsRoutes = require("./routes/PostsRoutes");
const PostsSecureRoutes = require("./routes/PostsSecureRoutes");
const ReelsRoutes = require("./routes/ReelsRoutes");
const ReelsSecureRoutes = require("./routes/ReelsSecureRoutes");
const CommentsRoutes = require("./routes/CommentsRoutes");
const CommentsSecureRoutes = require("./routes/CommentsSecureRoutes");

connectDB();

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(process.env.ALLOWED_ORIGINS.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(compress());
app.use(express.json());
app.use("/api/users/auth/", authRoutes);
app.use("/api/users/", UserOpenRoutes);
app.use("/api/users/secure", UserSecureRoutes);
app.use("/api/posts/", PostsRoutes);
app.use("/api/posts/secure/", PostsSecureRoutes);
app.use("/api/reels/", ReelsRoutes);
app.use("/api/reels/secure/", ReelsSecureRoutes);
app.use("/api/comments/", CommentsRoutes);
app.use("/api/comments/secure/", CommentsSecureRoutes);
app.use(errorHandler);

module.exports = app;