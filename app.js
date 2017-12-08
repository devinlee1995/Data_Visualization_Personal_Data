var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const app = express()


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(8000, function () {
  console.log('Final Project running!')
})
