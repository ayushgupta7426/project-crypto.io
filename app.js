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
const axios = require('axios');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const cors =require('cors');





dotenv.config();








//connecting databa

const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGODB_URL}`, {
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
app.use(cors());



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}






//routes
app.get("/", catchAsync(async (req, res) => {
    const baseURL = "https://api.coingecko.com/api/v3";
    const response = await axios.get(`${baseURL}/simple/price`, {
        params: {
            ids: `bitcoin,ethereum,binancecoin`,
            vs_currencies: 'USD'
        }
    });

    // console.log("Hello world");
    const ids = `bitcoin,ethereum,dogecoin,binancecoin,binance-peg-avalanche,harmonycoin,polkadot,near,cardano`;
    const r = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);

    // console.log(r.data);

    // img , name , current_price , price_change_percentage_24h, market_cap_change_24h


    res.render('index', { response: response.data, trendingCoin: r.data });
}));


app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/portfolio', user);
app.use('/buysell', buysell);
app.use('/users', user);



//error handlers
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('users/error', { err });
})

//listen

app.listen(port, () => {
    console.log('Serving on port 3000')
})
