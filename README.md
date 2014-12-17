chokidar-cmd
============

Command-line wrapper for [Chokidar](https://github.com/paulmillr/chokidar). Run shell command when file or file's in a
directory are changed.

## Usage
Install globally `npm install -g chokidar-cmd` or as a project dependency `npm install chokidar-cmd`.

Example usage: `chokidar-watch 'npm run less' src/styles.less`.

Use it directly from your package.json for watching without task runners!

```javascript
"scripts": {
    "less": "lessc src/styles.less > public/styles.css",
    "watch:less": "chokidar-watch 'npm run less' src/styles.less"
}
```
