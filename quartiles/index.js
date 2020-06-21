const fs = require("fs");
const xlsx = require("node-xlsx");

module.exports = function quartilesCollection(path) {
  validateQuartilesPath(path);

  const quartiles = parseQuartiles(path);
  console.log("Quartiles collection parsed\n");

  return function (req, res, next) {
    if (!req.quartiles) {
      req.quartiles = quartiles;
    }
    next();
  };
};

function validateQuartilesPath(path) {
  if (!path) {
    throw new TypeError(
      "quartilesCollection requires a valid path to collection file"
    );
  }
}

function parseQuartiles(path) {
  const parsedData = xlsx.parse(fs.readFileSync(path));

  const parsedCollection = parsedData[0].data;
  const startDataIndex = 3;
  const endDataIndex = parsedCollection.length - 2;

  const normalizedCollection = parsedCollection
    .slice(startDataIndex, endDataIndex)
    .map(compactRecord)
    .map(takeImportantValues)
    .filter(checkValidRecord);

  return normalizedCollection;
}

function compactRecord(record) {
  return record.filter((val) => !!val);
}

function takeImportantValues(record) {
  return {
    title: record[1],
    issn: matchIssn(record[2]),
    quartile: evalQuartile(record[14]),
  };
}

function checkValidRecord({ issn, quartile }) {
  return issn !== null && quartile !== null;
}

function matchIssn(value) {
  const matched = value.match(/\w+/gs);

  if (matched === null) return null;

  return matched.join("");
}

function evalQuartile(percentile) {
  const numValue = Number.parseFloat(percentile);

  if (Number.isNaN(numValue)) return null;

  return Math.ceil(numValue / 25);
}
