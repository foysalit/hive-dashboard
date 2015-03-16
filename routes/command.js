var express = require('express');
var router = express.Router();

router.get('/',function (req,res,next) {
	res.render('cmd', {
		title: 'Command', 
		community: 'Community'
	});

});


module.exports = router;