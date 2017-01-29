#!/usr/bin/env node
'use strict'; // eslint-disable-line

var chokidar = require('chokidar')
var child = require('child_process')
const objectAssign = require('object-assign');
var argv = require('yargs')
  .usage('Usage: chokidar-cmd -c "command" -t file-or-dir-or-glob')
  .command('chokidar-cmd', 'Watch directory or file for changes and run given command')
  .example('chokidar-cmd -c "npm run less" -t src/', 'Run less build on changes to styles')
  .example('chokidar-cmd -c "npm run less" -t src/ -t vendor/', 'Run less build on changes to either styles directory')
  .options({
    command: {
      demand: true,
      type: 'string',
      alias: 'c',
      describe: 'Command to run on file changes'
    },
    target: {
      demand: true,
      type: 'array',
      alias: 't',
      describe: 'Target file path, directory and its contents or glob pattern to watch. You can provide ' +
      'several targets using several target flags.'
    },
    verbose: {
      type: 'boolean',
      alias: 'v',
      describe: 'Show verbose output'
    },
    quiet: {
      type: 'boolean',
      alias: 'q',
      describe: 'Silence normal output from chokidar-cmd'
    },
    initial: {
      type: 'boolean',
      describe: 'Run command immediately after initial scan (when chokidar is ready)'
    },
    all: {
      type: 'boolean',
      describe: 'Run command on all file events and not just on changes'
    }
  })
  .help('help')
  .alias('help', 'h')
  .version(function () { return require('./package').version })
  .argv
var watcher = chokidar.watch(argv.target, { persistent: true })
var run = runner(argv.command)

watcher
  .on('error', function (err) {
    logError(err)
    process.exit(1)
  })
  .on('ready', function () { if (argv.initial) run('initial scan run') })
  .on(argv.all ? 'all' : 'change', run)

log('Watching "' + argv.target.join('", "') + '" and running command "' + argv.command + '" on changes')

function runner (command) {
  var running = false

  // linux passes stat as last argument but os x doesn't
  return function (event, path, stat) {
    if (path == null || typeof path === 'object') {
      path = event
      event = 'change'
    }

    verboseLog('Watch detected change. Path: "' + path + '" Event: "' + event + '"')
    if (running) return
    running = true
    verboseLog('Executing command: ' + command)

    var env = objectAssign({}, process.env, {FILENAME: path, EVENT: event})
    execAsync(command, env, function (err) {
      if (err) logError(err)
      else verboseLog('Command "' + command + '" completed successfully')

      running = false
    })
  }
}

function log (msg) {
  if (!argv.quiet) console.error('[chokidar-cmd]', msg)
}

function logError (err) {
  console.error('[chokidar-cmd] ERROR:', err)
}

function verboseLog (msg) {
  if (argv.verbose) log(msg)
}

function execAsync (cmd, env, callback) {
  var c = child.exec(cmd, {env: env}, function (err) {
    callback(err || null)
  })

  c.stdout.on('data', function (data) {
    process.stdout.write(data)
  })

  c.stderr.on('data', function (data) {
    process.stderr.write(data)
  })

  return c
}
