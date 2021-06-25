const path = require('path');
const { existsSync, mkdirSync } = require('fs');
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const db = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;
const hbs = exphbs.create();

// Restricts file size of images or any media uploaded to 10mb
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
    // Creates a temporary directory if it doesn't exist
    const dir = path.join(__dirname, 'tmp/');
    if (!existsSync(dir)) mkdirSync(dir, 0744);
  });
});