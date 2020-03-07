const fs = require("fs");
module.exports = path => {
  var contents = fs.readFileSync(
    process.cwd() + (path ? path : "/graphs.json")
  );
  return JSON.parse(contents);
};
