const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const connectDB = require("./config/dbConfig");
const errorHandler = require("./middlewares/errorHandler");
const testRoutes = require("./routes/testRoutes");

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
app.use(errorHandler);
app.use("/api/test/", testRoutes);

module.exports = app;