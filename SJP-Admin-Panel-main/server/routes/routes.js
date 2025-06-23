const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home/homeController');
const aboutController = require('../controllers/about/aboutController');
const stopController = require('../controllers/stops/stopController');
const sequenceController = require('../controllers/sequence/sequenceController');
const routeController = require('../controllers/route/routeController');
const userController = require('../controllers/user/userController');
const isAuthenticated = require('../../app');



// Public Routes
router.get('/', userController.login);
router.get('/signup', userController.signUp);
router.post('/signup', userController.postSignUp);
router.all('/login', userController.allLogin);
router.get('/logout', userController.logout);

// Protected Routes (Require Authentication)
router.use(isAuthenticated); // Apply isAuthenticated middleware to all routes below this line

// Home Page
router.get('/home', homeController.homepage);

// About
router.get('/about', aboutController.about);

// Stops
router.get('/addstop', stopController.addStop);
router.post('/addstop', stopController.postStop);
router.get('/viewstop/:id', stopController.viewStop);
router.get('/editstop/:id', stopController.editStop);
router.put('/editstop/:id', stopController.editPost);
router.delete('/editstop/:id', stopController.deleteStop);
// View All Stops 
router.get('/stops', stopController.stops);



// Sequence
router.get('/addsequence', sequenceController.addSequence);
router.post('/addsequence', sequenceController.postSequence);
// Route to add a stop to a sequence 
router.get('/addstopsequence/:id', sequenceController.addStopSequence);
router.post('/addstopsequence/:id', sequenceController.postStopSequence);
// Route to delete a stop from sequence
router.delete('/deletestopsequence/:seqId/:stopId', sequenceController.deleteStopSequence);
//----------------------------------------
router.get('/viewsequence/:id', sequenceController.viewSequence);
router.get('/editsequence/:id', sequenceController.editSequence);
router.put('/editsequence/:id', sequenceController.editPost);
router.delete('/editsequence/:id', sequenceController.deleteSequence);
// Route to view all sequences
router.get('/sequences', sequenceController.sequences);



// Routes
router.get('/addroute', routeController.addRoute);
router.post('/addroute', routeController.postRoute);
router.get('/viewroute/:id', routeController.viewRoute);
router.get('/editroute/:id', routeController.editRoute);
router.put('/editroute/:id', routeController.editPost);
router.delete('/editroute/:id', routeController.deleteRoute);
router.get('/routes', routeController.routes);







module.exports = router;