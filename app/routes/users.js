/**
 * Controller of users
 */
const router = require('express').Router();
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
//const request = require('request');
//const jwkToPem = require('jwk-to-pem');
//const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const config = require('../config.json');


/**
 * Global variables
 */
const User = require('../models/User');
const poolData = { 
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.clientId
};
const poolRegion = 'us-east-2';
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser;

/**
 * Get cognitoUser function
 */
function getCognitoUser() {
  return cognitoUser;
}
/**
 * domain/signup
 */
router.get('/signup', (req, res) => {
  res.render('users/signup');
});

/**
 * Store in database the user registation
 */
router.post('/signup', async (req, res) => {
  var attributeList = [];
  const { firstName, username, email, password, confirm_password } = req.body;

  var dataEmail = {
    Name: 'email',
    Value: email
  };
  var dataName = {
    Name: 'name',
    Value: firstName
  };
  var dataUsername = {
    Name: 'preferred_username',
    Value: username
  }

  var emailAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  var nameAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
  var usernameAttributes = new AmazonCognitoIdentity.CognitoUserAttribute(dataUsername);


  attributeList.push(emailAttributes);
  attributeList.push(nameAttributes);
  attributeList.push(usernameAttributes);

  var cognitoUser = "";
  userPool.signUp(email, password, attributeList, null, (err, data) => {
    if(err) {
      console.error(err);
      res.redirect('/signup');
    } else {
      cognitoUser = data.user;
      console.log('email is ' + cognitoUser.getUsername());
      req.flash('success_msg', 'Confirm your email, check in spam');
      res.redirect('/login');
    }
  });
});

/**
 * domain/login
 */
router.get('/login', (req, res) => {
  res.render('users/login');
});

/**
 * check if user is registred 
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const authenticationData = {
    Username: email,
    Password: password
  }

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  const userDetails = {
    Username: email,
    Pool: userPool
  }

  cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);
  if(cognitoUser != null) {
    console.log("SE HA LOGEADO");
  }
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: result => {
      var accessToken = result.getAccessToken().getJwtToken();
      console.log("access token " + accessToken + '\n');
      var idToken = result.getIdToken().getJwtToken();
      console.log("id token " + idToken + '\n');
      var refreshToken = result.getRefreshToken().getToken();
      console.log("refresh token " + refreshToken + '\n');
      res.redirect('/allRoutes');
    },
    onFailure: function(err) {
      console.error(err);
      res.redirect('/login');
    }
  });
});

/**
 * Logout
 */
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out now.');
  res.redirect('/login');
});

module.exports = router;