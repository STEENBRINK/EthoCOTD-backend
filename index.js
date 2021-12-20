const express = require("express");
const mongoose = require("mongoose");
const env = require('dotenv').config().parsed;
const app = express();

const cotdRoutes = require('./routes/cotd');
const episodeRoutes = require('./routes/episode');

app.use(express.json());

app.use('/api/cotd', cotdRoutes);
app.use('/api/episode', episodeRoutes);

mongoose.connect(env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on("error", (err)=>{console.error(err)});
db.once("open", () => {console.log("DB started successfully")});

app.listen(5000, () => {console.log("Server started: 5000")});