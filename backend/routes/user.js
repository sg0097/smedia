const express = require("express");
const { register} = require("../controllers/user");
const { login } = require("../controllers/user");
const { followUser} = require("../controllers/user");
const {isAuthenticated} = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/follow/:id").get(isAuthenticated,followUser);

module.exports = router;