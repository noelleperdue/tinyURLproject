var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
var session = require('express-session')
app.use(session({ secret: "secret"} ));
var flash = require('req-flash');
app.use(flash())

const users = [];

var salt = bcrypt.genSaltSync(10);

function generateRandomString() {
    var text = " ";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

const urlDatabase = {
  "b2xVn2": {
    username: "test123",
    url: "http://www.lighthouselabs.ca"
  }

};

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.session["username"], };
  res.render("urls_index", templateVars);
})


app.get("/", (req, res) => {
  res.redirect("/register");
});

app.get("/new", (req, res) => {
  if (req.session["id"] === users.id) {
    console.log(users)
       console.log(req.session["id"]);
    console.log(users.id);
  res.render("urls_new")
}
else {
  console.log("unauthenticated user, redirected to login")
  res.redirect("/login")
}
})


//  app.get("/urls/:id", (req, res) => {
//   let templateVars = { shortURL: req.params.id, username: req.session["username"], };
//   res.render("urls_show", templateVars);
// });

app.post("/new", (req, res) => {
  if (find.users(req.session[id])) {
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = {username: req.session["username"], url: req.body.longURL};
  res.redirect("/urls");
}
else {
  res.redirect("/login")
}
});

//

app.get("/u/:shortURL", (req, res) => {
  console.log(JSON.stringify(urlDatabase));
  let longURL = urlDatabase[req.params.shortURL].url;
   console.log(JSON.stringify(req.params.shortURL));
  res.redirect(longURL);
});

app.get('/urls/:id/edit', (req, res) => {
    res.render('urls_edit');
});

app.post("/urls/:id/delete", (req, res) => {
  {
  if (req.session["id"] === users.id) {
  console.log(req.params.id);
  console.log("hit");
  delete urlDatabase[req.params.id];
  console.log("hit2")
  res.redirect("/urls");
} else {
  res.redirect("/login")
}
};
});

app.post("/urls/:id/edit", (req, res) => {
  if (req.session["id"] === users.id) {
  var shortURL = req.params.id;
  urlDatabase[shortURL] = { username: req.session["username"], url: req.body.longURL };
  res.redirect("/urls");
} else if (req.session["username"] != urlDatabase.username) {
  res.redirect("/login")
}
});

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/")
})


app.post('/login', (req, res) => {
  const user = users.find(function(eachUser) {
    if ( eachUser.username == req.body.username ) {
      return true
    } else {
      return false;}
  });
  if(user){
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    // if the password is correct
    if(isCorrect){
      return res.redirect('/urls');
    }
    // otherwise, the passwords didn't match
    // req.flash('loginMessage', 'Incorrect password. Please retry.');
    // return res.redirect('/login');

    // // otherwise, the user isn't found, i.e. email isn't valid
    // req.flash('loginMessage', 'Please enter a valid email.');
    // return res.redirect('/login');
  } else if (!user) {
    res.render("login")
  }
});

app.get("/register", (req, res) => {
  res.render("register")
});

var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};


app.post("/register", (req, res) => {

const newUser = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    id: ID()
  };
  users.push(newUser);
  console.log(newUser);
  req.session.id = newUser.id;
  req.session.username = newUser.username;
  req.flash('newUsername', newUser.username);
  req.flash('newUserPassword', newUser.password);
  res.redirect('/new');
});




 app.listen(8080);
console.log('8080 is the magic port');