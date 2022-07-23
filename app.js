const express = require('express');
const app = express();
const path = require('path')
const session = require('express-session')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash');
const UserSchema = require('./schema/UserSchema');
const methodOverride = require('method-override');
const signup = require('./routes/signup');
const login = require('./routes/login');
const logout = require('./routes/logout');
const user = require('./routes/user');
const buysell = require('./routes/admin');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { middleware } = require('./middleware');
const axios=require('axios');
const port=process.env.port ||3000;







//connecting database

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fake-data2', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//session

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig))
app.use(flash());



//passport middlewares

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserSchema.authenticate()));


passport.serializeUser(UserSchema.serializeUser());
passport.deserializeUser(UserSchema.deserializeUser());

//other middlewares

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})







//routes
app.get("/", async(req, res) => {
    // const baseURL = "https://api.coingecko.com/api/v3";
    // const response = await axios.get(`${baseURL}/simple/price`, {
    //     params: {
    //         ids: `bitcoin,ethereum,binancecoin`,
    //         vs_currencies: 'INR'
    //     }
    // });
//    let price=100;
    res.render('index');
});


app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/portfolio', user);
app.use('/buysell', buysell);

//listen

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})
