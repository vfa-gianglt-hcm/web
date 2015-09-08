var apiURL = 'https://1dhhcnzmxi.execute-api.us-east-1.amazonaws.com/v1';
var staticURL = 'https://d1gxzanke6jb5q.cloudfront.net';

require("babel/register");
var views = require('./views');
var React = require('react');
var Promise = require('bluebird');
var fetch = require('node-fetch');
fetch.Promise = Promise;
var api = require('./api');
var api = new api(API_URL, fetch);

function generateHTML(data) {
  let cssSrc = staticURL + '/style.css';
  let scriptSrc = staticURL + '/main.js';
  let reactString = React.renderToString(React.createElement(views.Articles, data));
  return "<html><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width, initial-scale=1' /><link rel='stylesheet' type='text/css' href='" + cssSrc + "'><body><div id='react-mount'>" + reactString + "</div></body><script src='" + scriptSrc + "'></script></html>";
}

exports.handler = function(event, context) {
  console.log(event);
  api(event.username, event.id).then(generateHTML).then(context.succeed).catch(context.fail);
};