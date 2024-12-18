const express = require('express');
const path = require('path');
const app = express();

// Middlewarew
app.use(express.static(path.join(__dirname, 'public')));

// Set 'ejs' as the view engine and use 'ejs' as the views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ejs'));

// Use routes
const routes = require('./routes/routes');
app.use('/', routes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CatCache is running on http://localhost:${PORT}`);
});
