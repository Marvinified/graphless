const crossSpawn = require("cross-spawn");

exports.spawn = function spawn(command, args, opts, cb) {
  if (!opts.stdio) opts.stdio = args.quiet ? "ignore" : "inherit";

  var child = crossSpawn(command, args, opts);
  child.on("error", cb);
  child.on("close", function (code) {
    if (code !== 0) return cb(new Error("non-zero exit code: " + code));
    cb(null);
  });
  return child;
};

exports.sync = function sync(command, args, opts) {
  if (!opts.stdio) opts.stdio = args.quiet ? "ignore" : "inherit";

  return crossSpawn.sync(command, args, opts);
};

