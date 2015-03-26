#!/usr/bin/env node
"use strict";

var chokidar = require('chokidar')
var child = require('child_process')

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

    execAsync(command, function(err, output) {
      if (err) logError(err, output)
      running = false
    })
  }
}

function logError() {
  console.error('chokidar-cmd error:', arguments)
}

function usage() {
  console.log('Usage: chokidar-cmd \'command\' file-or-dir')
}

function execAsync(cmd, callback) {
  var output = ''

  var c = child.exec(cmd, {env: process.env, maxBuffer: 20*1024*1024}, function(err) {
    callback(err ? err : null, output)
  })

  c.stdout.on('data', function(data) {
    output += data
  });

  c.stderr.on('data', function(data) {
    output += data
    process.stdout.write(data)
  });

  return c
}
