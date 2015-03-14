var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'HIVE', 
		slogan: 'An open source experience'

	});
});

module.exports = router;