const User = require("../models/User");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //Duplicate Error
  if (err.code == 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  //Incorrect Email
  if(err.message==='Incorrect Email. Enter a valid email id') {
    errors.email='This email is not registered';
  }
  
  //Incorrect Password
  if(err.message==='Incorrect Password. Please try again!') {
    errors.password='Incorrect Password';
  }
  
  //Validation Errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 60;
const createToken = (id) => {
  return jwt.sign({ id }, "This is a secret string to hash with", {
    expiresIn: maxAge,
  });
};

module.exports.signUp_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signUp_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors =handleErrors(err);  
    res.status(400).json({errors});
  }
};
