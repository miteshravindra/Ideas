const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const favicon = require('serve-favicon');


const app = express();

// Favicon middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// Connect to mongoose
mongoose.connect('mongodb://localhost/ideas-app-dev')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname,'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express-session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//middleware for connect-flash
app.use(flash());

//Global variables
app.use(function(req,res,next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null
   next();
});

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Use routes
app.use('/ideas',ideas);
app.use('/users',users);

const port = process.env.PORT || 5000
app.listen(port, function () {
    console.log('App is listening');
});