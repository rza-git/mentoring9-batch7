const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute.js");
const taskRoute = require("./taskRoute.js")
const {authentication} = require("../middlewares/auth.js")

router.use("/users", userRoute);
// ONLY SIGNED USER
router.use(authentication)
router.use("/tasks", taskRoute);


module.exports = router;

