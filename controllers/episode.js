require('dotenv').config();
require('express');
const objectIDchecker = require('../middleware/objectIDhandler');
const EpisodeSchema = require('../models/episode');

const baseURL = "https://www.ethocotd.net/api/episodes/"

const getEpisode = (req, res) => {
    if(!objectIDchecker.isValidObjectId(req.params.id)) return res.status(400).json({message: req.params.id + ': is not a valid id'});
    EpisodeSchema.findById({_id:req.params.id}, (error, results) => {
        if(error){
            res.status(500).json({message: 'Finding Episode Failed'});
            console.log(error);
        } 
        else if(!results) res.status(404).json({message: 'No Episode Found'})
        else res.status(200).json(results);
    });
}

const getAllEpisodes = async (req, res) => {
    const episodes = await EpisodeSchema.find({}).sort({'episode_number': 1});

    console.log(episodes)

    try {
        res.status(200).json(episodes);
    } catch(e) {
        res.status(500).json({message: 'Getting Episodes Failed'});
        console.log(e);
    }
}

const findEpisode = async (req, res) => {
    let query = {};
    if(isNaN(req.params.searchtag)) {
        let regex = new RegExp(req.params.searchtag, 'i');
        query['title'] = {$regex: regex};
    }
    else query['episode_number'] = req.params.searchtag;

    EpisodeSchema.find(query, (error, results) => {
        if(error) {
            res.status(500).json({message: 'Searching failed'});
            console.log(error);
        } else if(!results || results.length === 0) res.status(404).json({message: 'No result found'});
        else res.status(200).json(results);
    });
}

const createEpisode = async (req, res) => {
    let validation = validateFields(req.body);
    if(!validation.passed) return res.status(validation.status).json(validation.json);

    const episode = new EpisodeSchema({
        title: req.body.title,
        episode_number: req.body.episode_number,
        release_date: req.body.release_date,
        cotd: req.body.cotd,
        youtube_id: req.body.youtube_id,
        season: req.body.season,
        minecraft_version: req.body.minecraft_version
    });

    episode.save().then(() => {
        episode.set(
            {
                _links: {
                    self: {
                        href: baseURL + episode._id
                    },
                    collection: {
                        href: baseURL
                    }
                }
            });
            episode.save();
        res.status(201).json(episode);
    }).catch((error) => {
        res.status(500).json({ message: 'Creation failed' });
        console.error(error);
    });
}

const updateEpisode = async (req, res) => {
    if(!objectIDchecker.isValidObjectId(req.params.id)) return res.status(400).json({message: req.params.id + ': is not a valid id'});
    let validation = validateFields(req.body);
    if(!validation.passed) return res.status(validation.status).json(validation.json);

    EpisodeSchema.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            title: req.body.title,
            episode_number: req.body.episode_number,
            release_date: req.body.release_date,
            cotd: req.body.cotd,
            youtube_id: req.body.youtube_id,
            season: req.body.season,
            minecraft_version: req.body.minecraft_version
        }
    }, {new:true}, (error, results) => {
        if(error){
            res.status(500).json({message: 'Update Failed'});
            console.log(error);
        } 
        else if(!results) res.status(404).json({message: 'No Episode Found'})
        else res.status(200).json(results);
    });
}

const deleteEpisode = async (req, res) => {
    if(!objectIDchecker.isValidObjectId(req.params.id)) return res.status(400).json({message: req.params.id + ': is not a valid id'});
    await EpisodeSchema.findByIdAndDelete({_id:req.params.id}).then(() => {
        res.status(200).json({message: 'Deletion Succesful'});
    }).catch((e) => {
        res.status(500).json({message: 'Deletion Failed'});
        console.log(e);
    });
}

const validateFields = (body) => {
    if(!body.title || body.title === '') return {status: 400, passed: false, json: { message: 'no title given'}};
    if(!body.episode_number) return {status: 400, passed: false, json: { message: 'no episode number given'}};
    if(!body.release_date) return {status: 400, passed: false, json: { message: 'no release date given'}};
    if(!body.youtube_id || body.youtube_id === '') return {status: 400, passed: false, json: { message: 'no youtube id given'}};

    if(body.release_date < Date.parse('2005-04-24') || body.release_date > Date.now()) return {status: 400, passed: false, json: { message: 'impossible date'}};
    if (!/^[a-zA-Z0-9_-]{11}$/.test(body.youtube_id)) return {status: 400, passed: false, json: { message: 'YouTube id not valid'}};
    if(body.minecraft_version && !/^((Alpha )|(Beta ))?(([1]){1}\.[0-9]{1,2})(\.[0-9]{1})?( pre-release)?$/.test(body.minecraft_version)) return {status: 400, passed: false, json: { message: 'Minecraft version invalid'}};

    if(body.cotd) for(cotd of body.cotd) {
        if(!objectIDchecker.isValidObjectId(cotd)) return {status: 400, passed: false, json: { message: 'cotd not valid'}};
    }

    return {passed: true}
}

module.exports = { getAllEpisodes, createEpisode, updateEpisode, deleteEpisode, getEpisode, findEpisode}