"use strict";

var chokidar = require('chokidar')
var exec = require('child_process').exec

var command = process.argv[2]
var target = process.argv[3]

if (!command || !target) {
  usage()
  process.exit(1)
}

var watcher = chokidar.watch(target, {persistent: true})
var run = runner(command)

watcher
  .on('error', logError)
  .on('change', run)

console.log('Watching', target, 'and running command "' + command + '" on changes')

function runner(command) {
  var running = false

  return function() {
    if (running) return
    running = true

    var p = exec(command, function(err, stdout, stderr) {
      if (err !== null) logError(err)
      running = false
    })

    p.stdout.on('data', process.stdout.write)
    p.stderr.on('data', process.stderr.write)
  }
}

function logError(err) {
  console.error('chokidar-cmd error:', err.message)
}

function usage() {
  console.log('Usage: chokidar-watch \'command\' file-or-dir')
}
