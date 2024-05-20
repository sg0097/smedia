const express= require("express");
const { createPost, likeAndUnlikePost,deletePost, getpostoffollowing, addcomment } = require("../controllers/post");
const {isAuthenticated } = require("../middlewares/auth");

const router = express.Router();


router.route("/post/upload").post(isAuthenticated,createPost);

router
.route("/post/:id")
.get(isAuthenticated,likeAndUnlikePost)
.delete(isAuthenticated, deletePost);

router.route("/posts").get(isAuthenticated,getpostoffollowing);
router.route("/post/comment/:id").put(isAuthenticated, addcomment);

module.exports = router;
