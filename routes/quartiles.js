var express = require("express");
var router = express.Router();

// Get journal quartile by issn
router.get("/:issn", function (req, res, next) {
  const { issn } = req.params;

  const searchIssn = issn.match(/\w+/gs).join("");
  const equalSearchIssn = (record) => record.issn === searchIssn;
  const searchResult = req.quartiles.find(equalSearchIssn);

  searchResult
    ? res.send({ data: searchResult })
    : res.status(404).send("Journal not found");
});

module.exports = router;
