var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'HIVE',
  	hivetab: 'HIVE?',
  	techtab: 'TECH.',
  	collabtab: 'COLLAB.',
  	docstab: 'DOCS',
  	forumtab: 'FORUM',
  	membershiptab: 'JOIN',
  	slogan: 'An open source experience'
  	});
});

module.exports = router;
