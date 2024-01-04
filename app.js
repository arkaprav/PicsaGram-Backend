const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const connectDB = require("./config/dbConfig");
const errorHandler = require("./middlewares/errorHandler");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/AuthRoutes");
const UserOpenRoutes = require("./routes/UserRoutes");
const UserSecureRoutes = require("./routes/UserSecureRoutes");
const path = require('path');

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

app.use(express.json());
app.use("static",express.static(path.join(__dirname, "profilePics")));
app.use("/api/test/", testRoutes);
app.use("/api/users/auth/", authRoutes);
app.use("/api/users/", UserOpenRoutes);
app.use("/api/users/update", UserSecureRoutes);
app.use(errorHandler);

module.exports = app;