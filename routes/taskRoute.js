const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController.js")
const {authorization} = require("../middlewares/auth.js")


// CRUD
router.get("/", taskController.findAll)
router.get("/:id", taskController.findOne)
router.post("/", taskController.create)
router.put("/:id", taskController.update)
// Hanya admin yang boleh
router.delete("/:id", authorization,  taskController.destroy)

module.exports = router;

