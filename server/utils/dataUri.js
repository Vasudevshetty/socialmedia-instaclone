const DataUriParser = require("datauri/parser");
const path = require("path");

const parser = new DataUriParser();

function getDataUri(file) {
  const extension = path.extname(file.originalname).toString();
  return parser.format(extension, file.buffer).content;
}

module.exports = getDataUri;
