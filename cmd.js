#!/usr/bin/env node
"use strict";

var chokidar = require('chokidar')
  , child = require('child_process')
  , argv = require('yargs')
    .usage('Usage: $0 -c "command" -t file-or-dir')
    .command('chokidar-cmd', 'Watch directory or file for changes and run given command')
    .example('$0 -c "npm run less" -t src/styles', 'Run less build on changes to styles')
    .string(['command', 'target'])
    .demand(['command', 'target'])
    .alias('command', 'c')
    .describe('command', 'Command to run on file changes')
    .alias('target', 't')
    .describe('target', 'Target file path to watch or directory to be watched recursively')
    .boolean('verbose')
    .alias('verbose', 'v')
    .describe('verbose', 'Show verbose output')
    .boolean('quiet')
    .alias('quiet', 'q')
    .describe('quiet', 'Silence normal output')
    .boolean('initial')
    .describe('initial', 'Run command immediately after initial scan (when chokidar is ready)')
    .help('help')
    .alias('help', 'h')
    .version(function() { return require('./package').version })
    .argv
  , watcher = chokidar.watch(argv.target, { persistent: true })
  , run = runner(argv.command)

watcher
  .on('error', function(err) {
    logError(err)
    process.exit(1)
  })
  .on('ready', function() { if (argv.initial) run('initial scan run') })
  .on('change', run)

log('Watching ' + argv.target + ' and running command "' + argv.command + '" on changes')

function runner(command) {
  var running = false

  return function(path) {
    verboseLog('Path "' + path + '" changed')
    if (running) return
    running = true
    verboseLog('Executing command: ' + command)
    execAsync(command, function(err, output) {
      if (err) logError(err)
      else verboseLog('Command "' + command + '" completed successfully')

      running = false
    })
  }
}

function log(msg) {
  if (!argv.quiet) console.log('[chokidar-cmd]', msg)
}

function logError(err) {
  console.error('[chokidar-cmd] ERROR:', err)
}

function verboseLog(msg) {
  if (argv.verbose) log(msg)
}

function execAsync(cmd, callback) {
  var output = ''

  var c = child.exec(cmd, { env: process.env, maxBuffer: 20 * 1024 * 1024 }, function(err) {
    callback(err ? err : null, output)
  })

  c.stdout.on('data', function(data) {
    output += data
    if (!argv.quiet) process.stdout.write(data)
  })

  c.stderr.on('data', function(data) {
    output += data
    process.stderr.write(data)
  })

  return c
}
