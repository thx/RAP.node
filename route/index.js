var express = require('express');
var router = express.Router();  

router.get('/', function(req, res) {
    res.json({ message: 'hi! welcome to our rap node api!' });   
});

module.exports = router;