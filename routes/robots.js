var express = require('express');
var router = express.Router();
var Robot = require('../models/robots');

router.get('/',function (req,res,next) {
	res.render('cmd', {
		title: 'Robot', 
	});
});

router.post('/availability', function (req, res){
	Robot.updateAvailability(req.params.status, req.params.id, function (){
		res.json({
			status: req.params.status
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