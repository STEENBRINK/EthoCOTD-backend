require('express');

const index = async (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
}


module.exports = { index }