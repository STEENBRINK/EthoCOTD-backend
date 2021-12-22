require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const nconf = require('nconf');
nconf.argv().env().file('keys.json');

const cotdRoutes = require('./routes/cotd');
const episodeRoutes = require('./routes/episode');
const headers = require('./middleware/headers');

const app = express();

//Middleware
app.use(express.json());

//Routes
app.use('/api/cotd', cotdRoutes);
app.use('/api/episodes', episodeRoutes);
app.get('/api/documentation', headers.checkAcceptHeader,(req, res) => {
    res.status(200).json({
        general: "An Accept header with application/json is required for all requests.",
        episode: {
            structure: {
                title: {
                    type: "String",
                    discription: "title of the episode",
                    required: true
                },
                episode_number: {
                    type: "Number",
                    discription: "number of the episode",
                    required: true
                },
                release_date: {
                    type: "Date",
                    discription: "Date the episode was realeased (in millis)",
                    required: true
                },
                youtube_id: {
                    type: "String",
                    discription: "string of 11 characters that is the youtube video id (https://youtu.be/{youtube_id} for the link to the video)",
                    required: true
                },
                cotd: {
                    type: "Array(ObjectId)",
                    discription: "Array of ObjectIds of Comments of the Day of the episode",
                    required: false
                },
                season: {
                    type: "Number",
                    discription: "The number of the let's play world/season of the let's play",
                    required: false
                },
                minecraft_version: {
                    type: "String",
                    discription: "version of minecraft the episode was played on, regex: /^((Alpha )|(Beta ))?(([1]){1}\.[0-9]{1,2})(\.[0-9]{1})?( pre-release)?$/",
                    required: false
                },_links: {
                    type: "Object",
                    discription: "an object with links to the episode itself and the collection of episodes"
                }
            },
            get_one: {
                discription: "Use ethocotd.net/api/episodes/{id} to get a specific episode",
                returns: "One episode as object"
            },
            get_all: {
                discription: "Use ethocotd.net/api/episodes/ to get all the episodes",
                returns: "Array with episodes as objects"
            },
            get_mutiple: {
                by_episode: "use ethocotd.net/api/episodes/find/{episode_number} to get one episode with exactly that number",
                by_searchtag: "use ethocotd.net/api/episodes/find/{searchtag} to get all the episodes with the {searchtag} in the title",
                returns: "Array with episode(s) as object(s)"
            }
        },
        cotd: {
            structure: {
                cotd_number: {
                    type: "Number",
                    discription: "number of the comment of the day",
                    required: true
                },
                episode_id: {
                    type: "ObjectId",
                    discription: "the ID of the episode the comment of the day is part of",
                    required: true
                },
                content: {
                    type: "String",
                    discription: "the comment itself",
                    required: true
                },
                user: {
                    type: "String",
                    discription: "the user who posted the comment",
                    required: true
                },
                answer: {
                    type: "String",
                    discription: "Etho's answer to the comment",
                    required: true
                },
                _links: {
                    type: "Object",
                    discription: "an object with links to the comment of the day itself and the episode it belongs to"
                }
            },
            get_one: {
                discription: "Use ethocotd.net/api/cotd/{id} to get a specific comment of the day",
                returns: "One comment of the day as object"
            },
            get_all: {
                discription: "Use ethocotd.net/api/cotd/ to get all the comments of the day",
                returns: "Array with comments of the day as objects"
            },
            get_mutiple: {
                by_episode: "use ethocotd.net/api/cotd/find/{episode_number} to get all the comments of the day for a specific episode",
                by_searchtag: "use ethocotd.net/api/cotd/find/{searchtag} to get all the episodes with the {searchtag} in either the comment, user or answer",
                returns: "Array with comment(s) of the day as object(s)"
            }
        }
    })
});

mongoose.connect(nconf.get('mongoUri'), {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on("error", (err)=>{console.error(err)});
db.once("open", () => {console.log("DB started successfully")});

app.listen(process.env.PORT, () => {});