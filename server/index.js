const express = require('express')
const path = require('path')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const db = require('./db/db')


app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', require('./api'));


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public'));
})


const dbStore = new SequelizeStore({ db: db });
dbStore.sync();

app.use(session({
  secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
  store: dbStore,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});

app.use( (err, req, res, next) => {
	console.error(err)
	console.error(err.stack)
	res.status(err.status || 500).send(err.message || 'Internal Server Error')
})



module.exports = app