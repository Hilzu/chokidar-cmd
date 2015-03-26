#!/usr/bin/env node
"use strict";

var chokidar = require('chokidar')
  , child = require('child_process')
  , argv = require('yargs')
    .usage('Usage: $0 -c "command" -t file-or-dir')
    .command('chokidar-cmd', 'Watch directory or file for file for changes and run given command')
    .example('$0 -c "npm run less" -t src/styles', 'Run less build on changes to styles')
    .demand(['command', 'target'])
    .alias('command', 'c')
    .alias('target', 't')
    .boolean('verbose')
    .alias('verbose', 'v')
    .describe('verbose', 'Show verbose output')
    .help('help')
    .alias('help', 'h')
    .version(function() { return require('./package').version })
    .argv

var watcher = chokidar.watch(argv.target, {persistent: true})
var run = runner(argv.command)

watcher
  .on('error', logError)
  .on('change', run)

console.log('Watching', argv.target, 'and running command "' + argv.command + '" on changes')

function runner(command) {
  var running = false

  return function() {
    if (running) return
    running = true
    verboseLog('Executing command', command)
    execAsync(command, function(err, output) {
      if (err) logError(err)
      else verboseLog('Command completed successfully.')

      running = false
    })
  }
}

function logError() {
  console.error('chokidar-cmd error:', arguments)
}

function verboseLog() {
  if (argv.verbose) console.log.apply(console, arguments)
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
