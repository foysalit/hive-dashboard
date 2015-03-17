var express = require('express');
var router = express.Router();
var Robot = require('../models/robots');

router.get('/',function (req,res,next) {
	res.render('cmd', {
		title: 'Robot', 
	});
});

router.post('/availability', function (req, res){
	console.log(req.body);
	Robot.updateAvailability(req.body.status, req.body.id, function (error, robot){
		console.log(robot);
		res.json({
			status: req.body.status
		});
	});
});

router.get('/availability', function (req, res){
	Robot.getAvailability(req.query.id, function (err, robot){
		console.log(err, robot);
		res.json({
			status: robot.available //mapping sttaus to available for js file cmd.js
		});
	});
});

module.exports = router;