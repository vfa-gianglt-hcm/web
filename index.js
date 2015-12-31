var USER_URL = 'https://s3.amazonaws.com/constellational-users';
var POST_URL = 'https://d2gs3048w5buml.cloudfront.net';

require("babel-core/register");
var koa = require('koa');
var serve = require('koa-static');
var render = require('koa-ejs');
var fetch = require('node-fetch');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var views = require('./views');

var app = koa();
var port = process.env.PORT || 3000;

function fetchUser(username) {
  return fetch(USER_URL + '/' + username).then(res => res.json());
}

function fetchPost(username, url) {
  return fetch(POST_URL + '/' + username + '/' + url).then(res => res.json());
}

render(app, {root: 'templates'});

app.use(serve('public'));

app.use(function *() {
  var splitURL = this.url.split('/');
  splitURL.shift();
  var username = splitURL.shift().toLowerCase();
  var id = splitURL.shift();
  var user = yield fetchUser(username).then((user) => {
    if ((id) && (user.posts.indexOf(id) > 0)) {
      user.posts.splice(user.posts.indexOf(id), 1);
      user.posts.unshift(id);
    }
    var promiseArr = user.posts.map(id => fetchPost(username, id));
    return Promise.all(promiseArr).then((data) => {
      user.posts = data;
      return user;
    });
  });
  var reactString = ReactDOMServer.renderToString(React.createElement(views.User, user));
  yield this.render('layout', {react: reactString});
});
  
app.listen(port);
