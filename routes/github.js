var express = require('express');
var router = express.Router();
var github = require('github'); //npm install github for api access
var passport = require('passport'); // must include again at route level
var GitHubStrategy = require('passport-github').Strategy;


// define strategy information
var strategy_options = {
    clientID: '0484d51fa69478689ab7',
    clientSecret: 'd99c8b737769c2215828dfbd4c701e587f6269ad',
    callbackURL: "http://localhost:3000/auth/github/callback",
}

//passport use gothub strategy keys
passport.use(new GitHubStrategy({
    clientID: '0484d51fa69478689ab7',
    clientSecret: 'd99c8b737769c2215828dfbd4c701e587f6269ad',
    callbackURL: "http://hiveproject/auth/github/callback"
  },
  //find the user withr returned data
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user); // onto the next piece of code
    });
  }
));

// serialize for express
passport.serializeUser(function(user, done) {
  done(null, user);
});

// regurjitate data so we can understand it
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//github/auth
router.get('/auth', passport.authenticate('github'));//send people to github login

//access by github/auth/callback
router.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// github/login
/*
router.get('/login', function (req, res){
	res.redirect('github/auth'); // 
});
*/

router.get('/', function (req, res){
	res.render('index', {
		home:'Welcome home'
	});
})




module.exports = router;