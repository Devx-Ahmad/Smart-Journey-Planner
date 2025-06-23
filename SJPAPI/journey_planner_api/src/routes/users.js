const express = require('express');
const session = require('express-session');
const router = express.Router();
const HttpStatusCodes = require('../utils/httpStatusCodes');
const User = require('../models/User');
const sessionMiddleware = require('../utils/sessionMiddleware');

router.use(sessionMiddleware);

// Define a route for user signup
router.post('/signup', (req, res) => {
  /**
   * @api {post} users/signup signup
   * @apiName PostSignup
   * @apiGroup users
   * @apiBody {String} name User's name
   * @apiBody {String} email User's email address
   * @apiBody {String} password Password set by user
   * @apiSuccess {String} message User registered successfully
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "User registered successfully"
   *     }
   * @apiError Conflict User already registered
   * @apiError InternalServerError Internal Server Error
   * @apiErrorExample 409
   *      Error 409: Conflict
   *     {
   *       "error": "User already registered",
   *       "message": "The requested user registration cannot be completed as the user is already registered."
   *     }
   * @apiErrorExample 500
   *     HTTP/1.1 500 InternalServerError
   *     {
   *       "error": "Failed to save user"
   *     }
   */

  const {name, email, password} = req.body;

  // Create a new user
  const newUser = new User({name, email, password});

  // Save the user to the database
  newUser
    .save()
    .then(() => {
      // Store the user ID in the session
      //req.session.userId = user._id;
      res
        .status(HttpStatusCodes.OK)
        .json({message: 'User registered successfully'});
    })
    .catch(err => {
      if (err.code == 11000)
        res.status(HttpStatusCodes.CONFLICT).json({
          error: 'User already registered',
          message:
            'The requested user registration cannot be completed as the user is already registered.',
        });
      else
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({error: 'Internal Server Error'});
    });
});

// Login route
router.post('/login', async (req, res) => {
  /**
   * @api {post} users/login login
   * @apiName PostLogin
   * @apiGroup users
   * @apiBody {String} email User's email address
   * @apiBody {String} password Password
   * @apiSuccess {String} message Login successful!.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "message": "Login successful!"
   *     }
   * @apiError Unothorized Invalid credentials
   * @apiError InternalServerError An error occurred during login
   * @apiErrorExample 401
   *      Error 401: Unothorized
   *     {
   *       "error": "Invalid credentials",
   *     }
   * @apiErrorExample 500
   *     HTTP/1.1 500 InternalServerError
   *     {
   *       "error": "An error occurred during login"
   *     }
   */
  const {email, password} = req.body;

  try {
    // Find the user by username in the MongoDB collection
    const user = await User.findOne({email});

    if (user && password == user.password) {
      // Set user as authenticated
      req.session.authenticated = true;
      req.session.username = email;
      res.status(HttpStatusCodes.OK).send({message: 'Login successful!'});
    } else {
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .send({error: 'Invalid credentials'});
    }
  } catch (error) {
    console.error('Error during login:', error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send({error: 'An error occurred during login'});
  }
});

// Logout route
router.get('/logout', (req, res) => {
  /**
   * @api {get} users/logout logout
   * @apiName GetLogout
   * @apiGroup users
   * @apiSuccess {String} message User loged out successfully!
   * @apiError error Internal Server Error
   */
  // Clear the session
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send({error: 'Something went wrong!'});
    } else {
      res
        .status(HttpStatusCodes.OK)
        .send({message: 'User loged out successfully!'});
    }
  });
});

// Define a route to retrieve user data
router.get('/getAllUsers', async (req, res) => {
  /**
   * @api {get} users/getAllUsers getAllUsers
   * @apiName GetGetAllUsers
   * @apiGroup users
   * @apiSuccess {String} name Name of user
   * @apiSuccess {String} email Email address of user
   * @apiError error Internal Server Error
   * @apiError error Unauthorized
   * @apiErrorExample 401
   *     Error 401 Unauthorized
   *     {
   *       "error": "Unauthorized. Please login first."
   *     }
   * @apiErrorExample 500
   *     HTTP/1.1 500 InternalServerError
   *     {
   *       "error": "Failed to retrieve users"
   *     }
   */
  if (!req.session.authenticated)
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send({error: 'Unauthorized. Please login first.'});

  try {
    const users = await User.find({}).select('name email').exec();
    res.end(JSON.stringify(users));
  } catch (err) {
    console.error(err);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({error: 'Failed to retrieve users'});
  }
});

module.exports = router;
