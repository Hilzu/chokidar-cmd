chokidar-cmd
============

⚠️ **This package is deprecated!** After releasing this package another one called
[chokidar-cli](https://github.com/kimmobrunfeldt/chokidar-cli) was
made for the same purpose. chokidar-cli is now [way more popular](http://www.npmtrends.com/chokidar-cmd-vs-chokidar-cli)
than this so I don't see much sense in maintaining this. Please migrate to
chokidar-cli.

Command-line wrapper for [Chokidar](https://github.com/paulmillr/chokidar). Run shell command when file or file's in a
directory are changed.

## Installation

Install globally `npm install -g chokidar-cmd` or as a project dependency `npm install chokidar-cmd`.

## CLI usage

    Usage: chokidar-cmd -c "command" -t file-or-dir-or-glob

    Commands:
      chokidar-cmd  Watch directory or file for changes and run given command

    Options:
      --command, -c  Command to run on file changes              [string] [required]
      --target, -t   Target file path, directory and its contents or glob pattern to
                     watch. You can provide several targets using several target
                     flags.                                       [array] [required]
      --verbose, -v  Show verbose output                                   [boolean]
      --quiet, -q    Silence normal output from chokidar-cmd               [boolean]
      --initial      Run command immediately after initial scan (when chokidar is
                     ready)                                                [boolean]
      --all          Run command on all file events and not just on changes[boolean]
      --help, -h     Show help                                             [boolean]
      --version      Show version number                                   [boolean]

    Examples:
      chokidar-cmd -c "npm run less" -t src/    Run less build on changes to styles
      chokidar-cmd -c "npm run less" -t src/    Run less build on changes to either
      -t vendor/                                styles directory

## npm run usage

Use it directly from your package.json for watching without task runners and without installing globally!

```javascript
{
    "devDependencies": {
        "chokidar-cmd": "^1.0.0"
    },
    "scripts": {
        "less": "lessc src/styles.less public/styles.css",
        "watch:less": "chokidar-cmd -c \"npm run less\" -t src/styles.less"
    }
}
```

    $ npm run watch:less


## Changelog

See [Releases](https://github.com/Hilzu/chokidar-cmd/releases).
