require('dotenv').config();
require('express');
const COTDSchema = require('../models/cotd');
const EpisodeSchema = require('../models/episode');
const objectIDhandler = require('../middleware/objectIDhandler');

const baseURL = "https://www.ethocotd.net/api/"
const cotdURL = baseURL + "cotd/";
const episodeURL = baseURL + "episodes/"

const getCOTD = async (req, res) => {
    if(!objectIDhandler.isValidObjectId(req.params.id)) return res.status(400).json({message: req.params.id + ': is not a valid id'});
    COTDSchema.findById({_id:req.params.id}, (error, results) => {
        if(error){
            res.status(500).json({message: 'Finding Comment Failed'});
            console.log(error);
        } 
        else if(!results) res.status(404).json({message: 'No Comment Found'})
        else res.status(200).json(results);
    });
}

const getAllCOTD = async (req, res) => {
    const comments = await COTDSchema.find({}).sort({'cotd_number': 1});

    try {
        res.status(200).json(comments);
    } catch(e) {
        res.status(500).json({message: 'Getting Comments Failed'});
        console.log(e);
    }
}

const findCOTD = async (req, res) => {
    let query = {};
    if(isNaN(req.params.searchtag)) {
        let regex = new RegExp(req.params.searchtag, 'i');
        query = { $or: [{'content': {$regex: regex}}, {'user': {$regex: regex}}, {'answer': {$regex: regex}}]};

        COTDSchema.find(query, (error, results) => {
            if(error) {
                res.status(500).json({message: 'Searching failed'});
                console.log(error);
            } else if(!results || results.length === 0) res.status(404).json({message: 'No result found'});
            else res.status(200).json(results);
        });
    }
    else {
        query['episode_number'] = req.params.searchtag;
        let result;

        await EpisodeSchema.find(query, (error, results) => {
            if(error) {
                res.status(500).json({message: 'Searching failed'});
                console.log(error);
            } else if(!results || results.length === 0) res.status(404).json({message: 'No result found'});
            else {
                if(!results[0].cotd || results[0].cotd.length === 0) res.status(404).json({message: 'Episode does not have any COTD'});
                else result = results[0].cotd;
            }
        }).clone();

        let response = [];
        let i = 0;
        for(cotd_id of result){
            let cotd = await COTDSchema.findById(cotd_id);
            response[i] = cotd;
            i++;
        }
        res.status(200).json(response);
    }
}

const createCOTD = async (req, res) => {
    let validation = await validateFields(req.body);
    if(!validation.passed) return res.status(validation.status).json(validation.json);

    req.body.episode_id = objectIDhandler.creatObjectID(req.body.episode_id);
    const cotd = new COTDSchema({
        cotd_number: req.body.cotd_number,
        episode_id: req.body.episode_id,
        content: req.body.content,
        user: req.body.user,
        answer: req.body.answer
    });

    cotd.save().then(() => {
        addCOTDtoEpisode(cotd.episode_id, cotd._id);
        cotd.set(
            {
                _links: {
                    self: {
                        href: cotdURL + cotd._id
                    },
                    episode: {
                        href: episodeURL + cotd.episode_id
                    }
                }
            });
            cotd.save();
        res.status(201).json(cotd);
    }).catch((error) => {
        res.status(500).json({ message: 'Creation failed' });
        console.error(error);
    });
}

const updateCOTD = async (req, res) => {
    if(!objectIDhandler.isValidObjectId(req.params.id)) return res.status(400).json({message: req.params.id + ': is not a valid id'});
    let validation = validateFields(req.body);
    if(!validation.passed) return res.status(validation.status).json(validation.json);

    COTDSchema.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            cotd_number: req.body.cotd_number,
            episode_id: req.body.episode_id,
            content: req.body.content,
            user: req.body.user,
            answer: req.body.answer
        }
    }, {new:true}, (error, results) => {
        if(error){
            res.status(500).json({message: 'Update Failed'});
            console.log(error);
        } 
        else if(!results) res.status(404).json({message: 'No Comment Found'})
        else res.status(200).json(results);
    });

}

const deleteCOTD = async (req, res) => {
    if(!objectIDhandler.isValidObjectId(req.params.id)) return res.status(400).json({message: req.params.id + ': is not a valid id'});
    await COTDSchema.findByIdAndDelete({_id:req.params.id}).then(() => {
        res.status(200).json({message: 'Deletion Succesful'});
    }).catch((e) => {
        res.status(500).json({message: 'Deletion Failed'});
        console.log(e);
    });
}

const validateFields = async (body) => {
    if(!body.cotd_number) return {status: 400, passed: false, json: { message: 'no cotd number given'}};
    if(!body.episode_id) return {status: 400, passed: false, json: { message: 'no episodeID given'}};
    if(!body.content || body.content === '') return {status: 400, passed: false, json: { message: 'no content given'}};
    if(!body.user || body.user === '') return {status: 400, passed: false, json: { message: 'no user given'}};
    if(!body.answer || body.answer === '') return {status: 400, passed: false, json: { message: 'no answer given'}};

    if(!objectIDhandler.isValidObjectId(body.episode_id)) return {status: 400, passed: false, json: { message: 'Episode ID is not a valid ID'}};

    let episodeExists = await findEpisodeById(body.episode_id);

    if(!episodeExists) return {status: 400, passed: false, json: { message: 'Episode for comment not found'}};

    return {passed: true}
}

const findEpisodeById = async (id) => {
    let error;
    let result;
    await EpisodeSchema.findById({_id:id}, (e, r) => {
        if(e) error = e;
        if(r) result = r;
    }).clone();

    if(error) console.error(e);
    else{
        return result;
    }
}

const addCOTDtoEpisode = async (episode_id, comment_id) => {
    console.log(episode_id, comment_id)
    EpisodeSchema.findOneAndUpdate({_id: episode_id}, {
        $push: { cotd: comment_id}
    }, {new:true}).then((res) => {
        console.log(res)
    }).catch((e)=>{
        console.error(e);
    });
}

module.exports = { getCOTD, getAllCOTD, findCOTD, createCOTD, updateCOTD, deleteCOTD }