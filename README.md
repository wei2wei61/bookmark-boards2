# BookMark Boards

X posts, YouTube videos, and text notes can be saved into local boards.

## Structure

- `index.html` - page markup and CDN dependencies
- `assets/css/styles.css` - app styles
- `assets/js/firebase.js` - cloud/local initialization and persistence
- `assets/js/app.js` - board, card, tag, import, and export behavior

When the app is opened outside the hosted Firebase/Canvas environment, data is saved to the browser's `localStorage`. Use the export button for backups before clearing browser data.
