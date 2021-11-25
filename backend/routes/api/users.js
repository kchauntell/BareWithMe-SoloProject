const express = require('express');
const asyncHandler = require('express-async-handler');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true})
    .withMessage('Please provide a first name.')
    .isLength({max: 50})
    .withMessage('First Name cannot exceed 50 Characters'),
    check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a last name.')
    .isLength({max: 50})
    .withMessage('Last Name cannot exceed 50 Characters'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage("Please provide email address.")
    .isLength({ max: 256 })
    .withMessage("Email cannot be longer than 256 characters.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom((value) => {
      return User.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("Provided email address already in use.");
        }
      });
    }),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 3 })
    .withMessage('Please provide a username with at least 3 characters.')
    .isLength({ max: 30 })
    .withMessage("Username cannot be longer than 100 characters.")
    .custom((value) => {
      return User.findOne({
        where: {
          username: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("Provided username already in use.");
        }
      });
    }),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.')
    .isLength({ min: 4 })
    .withMessage('Password must be 4 characters or more.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1: lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please confirm password.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
    handleValidationErrors
];


// Sign up
router.post(
  '/',
  validateSignup,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);

    return res.json({
      user
    });
  })
);

module.exports = router;
