var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Web of Science Quartile Collection");
});

module.exports = router;
