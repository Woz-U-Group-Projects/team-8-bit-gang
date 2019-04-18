var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
var models = require('../models');
var nodemailer = require('nodemailer');
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});


router.post('/signup', function(req, res, next) {
  models.users
    .findOrCreate({
      where: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Username: req.body.username,
        Password: req.body.password
      }
    })
    .spread(function(result, created) {
      if (created) {
        res.redirect('/users/login');
      } else {
        res.send('this user already exists');
      }
    });
});




router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login'
}),
 function(req, res, next) {
      res.redirect('/game.html');
    
});

module.exports = router;


