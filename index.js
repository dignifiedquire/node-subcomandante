var comandante = require('comandante')
var Path = require('path')

var subcom = Path.join(__dirname, 'subcom')
var node = process.argv[0]

// spawn a child process that will only live
// as long as its parent. If the parent dies,
// so will the child. (this should work already,
// but it doesn't always work... hence this.)
module.exports = function (cmd, args, opts) {
  if (Array.isArray(cmd)) {
    opts = args;
    args = cmd.slice(1);
    cmd = cmd[0];
  }
  opts = opts || {}

  var w = opts.waitPid || process.pid
  delete opts.waitPid

  args = [subcom, w, cmd].concat(args)
  var cmd = comandante(node, args, opts)

  // catch SIGKILL and send SIGHUP so subcom kills the child.
  cmd.kill_ = cmd.kill
  cmd.kill = function(sig) {
    if (sig === 'SIGKILL') {
      sig = 'SIGHUP'
    }
    cmd.kill_(sig)
  }

  return cmd
}
