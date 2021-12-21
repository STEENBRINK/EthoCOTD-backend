var ObjectId = require('mongoose').Types.ObjectId;

const isValidObjectId = (id) => {
    return (ObjectId.isValid(id) && String(new ObjectId(id)) === id);
}

const creatObjectID = (id) => {
    return(new ObjectId(id));
}

module.exports = {isValidObjectId, creatObjectID}