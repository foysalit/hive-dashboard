var express = require('express');
var router = express.Router();
// login/ POST
router.post('/',function (req,res,next) {
	var user = require('../models/users');
	var email = req.param('email');
	var password = req.param('password');
	user.login(email,password,function(error,doc){

		console.log(error,doc);
		if(!error&&doc){
			req.session.userInfo=email;

			res.redirect('/command');
		}else{
			res.redirect('/');
		}
	});
});
// login/ GET
router.get('/',function(req,res,next){
	if(req.session.userInfo){
		res.redirect('/');
	}else{
		res.redirect('/command');
	}
});

router.get('/logout', function (req, res){
	req.session.destroy(function(){
		res.redirect('/');
	})
})

module.exports = router;