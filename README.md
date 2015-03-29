chokidar-cmd
============

[![Build Status](https://travis-ci.org/Hilzu/chokidar-cmd.svg)](https://travis-ci.org/Hilzu/chokidar-cmd)

Command-line wrapper for [Chokidar](https://github.com/paulmillr/chokidar). Run shell command when file or file's in a
directory are changed.

## Installation

Install globally `npm install -g chokidar-cmd` or as a project dependency `npm install chokidar-cmd`.

## CLI usage

    Usage: chokidar-cmd -c "command" -t file-or-dir
    
    Commands:
      chokidar-cmd    Watch directory or file for changes and run given command
    
    Options:
      --command, -c  Command to run on file changes                       [required]
      --target, -t   Target file path, directory and its contents or glob pattern
                     to watch. You can provide several targets using several target
                     flags.                                               [required]
      --verbose, -v  Show verbose output
      --quiet, -q    Silence normal output
      --initial      Run command immediately after initial scan (when chokidar is
                     ready)
      --help, -h     Show help
      --version      Show version number
    
    Examples:
      chokidar-cmd -c "npm run less" -t           Run less build on changes to
      src/styles                                  styles
      chokidar-cmd -c "npm run less" -t           Run less build on changes to
      src/styles -t ext/styles                    either styles directory


## npm run usage

Use it directly from your package.json for watching without task runners and without installing globally!

```javascript
{
    "devDependencies": {
        "chokidar-cmd": "^1.0.0"
    },
    "scripts": {
        "less": "lessc src/styles.less public/styles.css",
        "watch:less": "chokidar-cmd -c 'npm run less' -t src/styles.less"
    }
}
```

    $ npm run watch:less


## Changelog

See [Releases](https://github.com/Hilzu/chokidar-cmd/releases).
