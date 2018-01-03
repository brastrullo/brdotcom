const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');

const PORT = 3000;
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.post('/mailer', jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log('receiving data...');
  console.log('body is ', req.body);
  res.send(req.body);
});

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

app.get('/mailer', (req, res) => res.json(res.body));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
// package.json "serve": "browser-sync start --cors --reload-delay 100 -s -f \"styles.css,bundle.js,index.html\"",
