var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'HIVE', 
		slogan: 'An open source experience'

	});
});

router.post('/new_user',function(req,res,next){
	var User = require('../models/users');
	var email = req.param('email');
	var fname = req.param('fname');
	var lname = req.param('lname');
	var interests = req.param('interests');
	var password = req.param('testing');
	var provider = req.param('provider');
	console.log(email, fname, provider);

	User.create(email,fname,lname,interests,password,provider,function(error,doc){
		console.log(error,doc);
		res.redirect('/')
	});
});


module.exports = router;