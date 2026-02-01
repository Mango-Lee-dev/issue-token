const express = require("express");
const { verifyToken } = require("../middlewares");
const router = express.Router();
const { createToken, tokenTest } = require("../controllers/v1");

//  v1/token
router.post("/token", createToken);
router.get("/test", verifyToken, tokenTest);

module.exports = router;
