var express = require('express');
var router = express.Router();
var Robot = require('../models/robots');

router.get('/',function (req,res,next) {
	Robot.fetchRobots(function (robots){
		res.render('cmd', {
			title: 'Command', 
			community: 'Community',
			robots: robots
		});
	});
});



module.exports = router;