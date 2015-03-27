chokidar-cmd
============

Command-line wrapper for [Chokidar](https://github.com/paulmillr/chokidar). Run shell command when file or file's in a
directory are changed.

## Installation

Install globally `npm install -g chokidar-cmd` or as a project dependency `npm install chokidar-cmd`.

## CLI usage

    Usage: chokidar-cmd -c "command" -t file-or-dir
    
    Commands:
      chokidar-cmd    Watch directory or file for changes and run given command
    
    Options:
      --verbose, -v  Show verbose output
      --quiet, -q    Silence normal output
      --help, -h     Show help
      --version      Show version number
      --command, -c                                                       [required]
      --target, -t                                                        [required]
    
    Examples:
      chokidar-cmd -c "npm run less" -t src/styles    Run less build on changes to styles


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
