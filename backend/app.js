const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const userRoutes = require("./Routes/userRoutes.js");
const mainRoutes = require("./Routes/mainRoutes.js");
const tweetRoutes = require("./Routes/tweetRoutes.js");
const connectDB = require ("./Database/db.js")

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';



// ------------------------------------ CONNECT TO DB --------------------------


connectDB()



// ------------------------------------ CORS ------------------------------------



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// ------------------------------------ ROUTES ------------------------------------




app.use("/api", userRoutes, tweetRoutes);
app.use(mainRoutes);

app.get("/", (req, res) => {
  res.send("Avaiable paths:\n/allUsers\n/allTweets");
});




// ------------------------------------ SERVER ------------------------------------





app.listen(PORT,HOST ,  () => {
  console.log(`Server running at http://${HOST}:${PORT}/`)
});



// ------------------------------------ DEVELOPER ▼ ------------------------------------





console.log("\n");
console.log("TOUSEEF HUSSAIN");
console.log("\n");
