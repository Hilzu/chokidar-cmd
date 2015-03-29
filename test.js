var os = require('os')
var path = require('path')
var spawn = require('child_process').spawn
var fs = require('fs')
var assert = require('chai').assert
var touch = require('touch')
var tempdir = os.tmpdir()
var chokidarCmd = path.resolve(__dirname, './cmd.js')
var p, writeTimer

afterEach(function() {
  p.kill()
  clearInterval(writeTimer)
})

test('runs command on file change', function(done) {
  var target = path.resolve(tempdir, './' + 'test-target-' + Math.random())
  var echoText = target + '-changed-' + Math.random()

  touch.sync(target, function(err) { assert.isNull(err) })

  writeTimer = setInterval(function() { appendToFile(target) }, 500)
  p = spawn(chokidarCmd, ['-t', target, '-c', echoCmd(echoText), '-v'], { cwd: tempdir })

  p.stdout.on('data', function(data) {
    process.stdout.write(data)
    if (new RegExp('^' + echoText).test(data.toString())) done()
  })

  p.stderr.on('data', function(data) {
    process.stderr.write(data)
  })

  p.on('error', function(err) {
    assert.fail(err)
  })
})

function echoCmd(msg) {
  return process.execPath + ' -e "console.log(\'' + msg + '\')"'
}

function appendToFile(file) {
  fs.writeFile(file, 'test', function(err) {
    assert.isNull(err)
  })
}
