var cors = require('cors');
var express = require('express');

export default function addCors() {
  let app = express();
  app.options('*', cors());
  app.use(cors());
}
