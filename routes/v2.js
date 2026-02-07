const express = require("express");
const { verifyToken, apiLimiter, deprecated } = require("../middlewares");
const router = express.Router();
const {
  createToken,
  tokenTest,
  getMyPosts,
  getHashtagPosts,
} = require("../controllers/v1");

//  v1/token
router.post("/token", apiLimiter, createToken);
router.get("/test", verifyToken, tokenTest);

router.get("/posts/my", verifyToken, getMyPosts);
router.get("/posts/hashtag/:title", verifyToken, getHashtagPosts);

module.exports = router;
