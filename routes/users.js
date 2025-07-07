var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response");
const saltRounds = 10;

router.post("/register", async function (req, res, next) {
  const { username, email, password } = req.body;
  try {
    const exists = await userSchema.findOne({ email });
    if (exists) {
      return errorResponse(res, 400, "Email already in use", null);
    }
    if (!password) {
      return errorResponse(res, 400, "Password is Required", null);
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userSchema({ username, email, password: hashedPassword });
    await user.save();
    return successResponse(res, 201, `User registered successfully`);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err.message);
  }
});

router.put("/users/:id/approve", async function (req, res, next) {
  const { id } = req.params;
  try {
    const user = await userSchema.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found", null);
    }
    if (user.isApprove) {
      return errorResponse(res, 400, "User is already approved", null);
    }
    user.isApprove = true;
    await user.save();

    const data = {
      id: user._id,
      username: user.username,
      email: user.email,
      isApprove: user.isApprove,
    };
    return successResponse(res, 200, "User approved successfully", data);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong.", err.message);
  }
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await userSchema.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password.", null);
    }

    if (!user.isApprove) {
      return errorResponse(
        res,
        401,
        "Account not approve yet, Please wait for admin approval.",
        null
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password.", null);
    }

    var token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isApprove: user.isApprove
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    let payload = {
      accessToken: token,
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return successResponse(res, 200, "Login Successful.", payload);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong.", err.message);
  }
});

module.exports = router;
