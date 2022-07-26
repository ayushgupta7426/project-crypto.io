const express = require('express');
const mongoose = require('mongoose');
const User = require('../schema/UserSchema');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');



router.get('/', isLoggedIn, (req, res) => {
    console.log(req.user.id);
    res.render('admin/buysellform');
})

router.post('/buy', isLoggedIn, catchAsync(async (req, res) => {
    // console.log("user ID from req.user", req.user._id);
    const userId = req.user.id;
    const { x1, y, z } = req.body;
    let x = parseInt(x1);

    console.log("body", typeof x, x, y, z);

    const user = await User.findById(req.user.id );
    
    let portfolio = user.portfolio;

    // console.log("user", user);
    // console.log("portfolio", portfolio);


    if (portfolio.length === 0) {
        console.log("inside first if");
        const initialInvestmentAccordingToCoinSchema = {
            initialInvestment: 0,
            coinName: z
        }

        const initialInvestmentAccordingToCoinAndCompanySchema = {
            initialInvestment: 0,
            companyName: y,
            coinName: z
        }

        const holdingAccordingToCoinSchema = {
            numberOfCoins: 0,
            coinName: z
        }

        const holdingAccordingToCoinAndCompanySchema = {
            numberOfCoins: 0,
            companyName: y,
            coinName: z
        }

        const initialInvestmentAccordingToCoin = [initialInvestmentAccordingToCoinSchema];
        const initialInvestmentAccordingToCoinAndCompany = [initialInvestmentAccordingToCoinAndCompanySchema];
        const holdingAccordingToCoin = [holdingAccordingToCoinSchema];
        const holdingAccordingToCoinAndCompany = [holdingAccordingToCoinAndCompanySchema];

        const portfolioSchema = {
            initialInvestmentAccordingToCoin,
            initialInvestmentAccordingToCoinAndCompany,
            holdingAccordingToCoin,
            holdingAccordingToCoinAndCompany
        }
        portfolio.push(portfolioSchema);
    }

    console.log("portfolio after first if", portfolio);

    /* Net investment Keval coin ke hisab se */
    const initialInvestmentAccordingToCoin = portfolio[0].initialInvestmentAccordingToCoin; // array
    let n = initialInvestmentAccordingToCoin.length
    let one = false;
    for (let i = 0; i < n; i++) {
        if (initialInvestmentAccordingToCoin[i].coinName === z) {
            initialInvestmentAccordingToCoin[i].initialInvestment += x;
            one = true;
        }
    }
    if (one === false) {
        const initialInvestmentAccordingToCoinSchema = {
            initialInvestment: x,
            coinName: z
        }
        portfolio[0].initialInvestmentAccordingToCoin.push(initialInvestmentAccordingToCoinSchema);
    }
    /* Net investment Keval coin ke hisab se */


    /* Net investment of a particular coin in a particular company */
    const initialInvestmentAccordingToCoinAndCompany = portfolio[0].initialInvestmentAccordingToCoinAndCompany; // array
    let two = false;
    n = initialInvestmentAccordingToCoinAndCompany.length;
    for (let i = 0; i < n; i++) {
        if (initialInvestmentAccordingToCoinAndCompany[i].coinName === z && initialInvestmentAccordingToCoinAndCompany[i].companyName === y) {
            initialInvestmentAccordingToCoinAndCompany[i].initialInvestment += x;
            two = true;
        }
    }
    if (two === false) {
        const initialInvestmentAccordingToCoinAndCompanySchema = {
            initialInvestment: x,
            companyName: y,
            coinName: z
        }
        portfolio[0].initialInvestmentAccordingToCoinAndCompany.push(initialInvestmentAccordingToCoinAndCompanySchema);
    }
    /* Net investment of a particular coin in a particular company */






    // const response = await axios("/", {});
    // const price = response.coin.price;


    // console.log(z);
    // fetch price
    const baseURL = "https://api.coingecko.com/api/v3";
    const response = await axios.get(`${baseURL}/simple/price`, {
        params: {
            ids: `${z}`,
            vs_currencies: 'INR'
        }
    });

    let price = response.data[`${z}`]['inr'];
    console.log(price);

    /* Net holding of a particular coin  */
    const holdingAccordingToCoin = portfolio[0].holdingAccordingToCoin; // array
    let three = false;
    n = holdingAccordingToCoin.length;
    for (let i = 0; i < n; i++) {
        if (holdingAccordingToCoin[i].coinName === z) {
            holdingAccordingToCoin[i].numberOfCoins += x / price;
            three = true;
        }
    }
    if (three === false) {
        const holdingAccordingToCoinSchema = {
            numberOfCoins: x / price,
            coinName: z
        }
        portfolio[0].holdingAccordingToCoin.push(holdingAccordingToCoinSchema);
    }
    /* Net holding of a particular coin  */



    /* Net holding of a particular coin in a particular company */
    const holdingAccordingToCoinAndCompany = portfolio[0].holdingAccordingToCoinAndCompany; // array
    let four = false;
    n = holdingAccordingToCoinAndCompany.length;
    for (let i = 0; i < n; i++) {
        if (holdingAccordingToCoinAndCompany[i].coinName === z && holdingAccordingToCoinAndCompany[i].companyName === y) {
            holdingAccordingToCoinAndCompany[i].numberOfCoins += x / price;
            four = true;
        }
    }
    if (four === false) {
        const holdingAccordingToCoinAndCompanySchema = {
            numberOfCoins: x / price,
            companyName: y,
            coinName: z
        }
        portfolio[0].holdingAccordingToCoinAndCompany.push(holdingAccordingToCoinAndCompanySchema);
    }
    /* Net holding of a particular coin in a particular company */


    const finalUser = await User.findOneAndUpdate({ _id: userId }, { portfolio });
    req.flash('success','Asset Bought Successfully ');
    res.redirect("/buysell");
}));

// router.post('/sell', isLoggedIn,catchAsync( async (req, res) => {
//     // console.log("user ID from req.user", req.user._id);
//     const userId = req.user._id;
//     const { x1, y, z } = req.body;

//     console.log("body", typeof x1, x1, y, z);

//     let x = parseInt(x1);
//     x = x * -1;

//     console.log("body", typeof x, x, y, z);

//     const user = await User.findOne({ _id: req.user.id });

//     let portfolio = user.portfolio;

//     // console.log("user", user);
//     // console.log("portfolio", portfolio);


//     if (portfolio.length === 0) {
//         req.flash('error', 'Cannot sell before buying');
//         res.redirect('/buysell');
//     }

//     console.log("portfolio after first if", portfolio);



//     /* Net investment of a particular coin in a particular company */
//     const initialInvestmentAccordingToCoinAndCompany = portfolio[0].initialInvestmentAccordingToCoinAndCompany; // array
//     let two = false;
//     n = initialInvestmentAccordingToCoinAndCompany.length;
//     for (let i = 0; i < n; i++) {
//         if (initialInvestmentAccordingToCoinAndCompany[i].coinName === z && initialInvestmentAccordingToCoinAndCompany[i].companyName === y) {
//             if (initialInvestmentAccordingToCoin[i].initialInvestment >= x) {
//             initialInvestmentAccordingToCoinAndCompany[i].initialInvestment += x;
//             two = true;
//             }
           
//         }
//     }
//     if (two === false) {
//         req.flash('error', "cannot sell");
//         return res.redirect('/buysell');
//     }
//     /* Net investment of a particular coin in a particular company */

//     /* Net investment Keval coin ke hisab se */
//     const initialInvestmentAccordingToCoin = portfolio[0].initialInvestmentAccordingToCoin; // array
//     let n = initialInvestmentAccordingToCoin.length
//     let one = false;
//     for (let i = 0; i < n; i++) {
//         if (initialInvestmentAccordingToCoin[i].coinName === z) {
//             if (initialInvestmentAccordingToCoin[i].initialInvestment>=x)
//             {
//             initialInvestmentAccordingToCoin[i].initialInvestment += x;
//             one = true;
//             }
          
//         }
//     }
//     if (one === false) {
//         req.flash('error', "cannot sell");
//         return res.redirect('/buysell');
//     }
//     /* Net investment Keval coin ke hisab se */








    // const response = await axios("/", {});
    // const price = response.coin.price;

//     const baseURL = "https://api.coingecko.com/api/v3";
//     const response = await axios.get(`${baseURL}/simple/price`, {
//         params: {
//             ids: `${z}`,
//             vs_currencies: 'INR'
//         }
//     });

//     let price = response.data[`${z}`]['inr'];


//     /* Net holding of a particular coin  */
//     const holdingAccordingToCoin = portfolio[0].holdingAccordingToCoin; // array
//     let three = false;
//     n = holdingAccordingToCoin.length;
//     for (let i = 0; i < n; i++) {
//         if (holdingAccordingToCoin[i].coinName === z) {
//             holdingAccordingToCoin[i].numberOfCoins = Math.max(0, holdingAccordingToCoin[i].numberOfCoins+x / price);
//             three = true;
//         }
//     }
//     if (three === false) {
//         req.flash('error', "cannot sell");
//         return res.redirect('/buysell');
//     }
//     /* Net holding of a particular coin  */



//     /* Net holding of a particular coin in a particular company */
//     const holdingAccordingToCoinAndCompany = portfolio[0].holdingAccordingToCoinAndCompany; // array
//     let four = false;
//     n = holdingAccordingToCoinAndCompany.length;
//     for (let i = 0; i < n; i++) {
//         if (holdingAccordingToCoinAndCompany[i].coinName === z && holdingAccordingToCoinAndCompany[i].companyName === y) {

//             holdingAccordingToCoinAndCompany[i].numberOfCoins += Math.max(0,x / price);
//             four = true;
//         }
//     }
//     if (four === false) {
//         req.flash('error', "cannot sell");
//         return res.redirect('/buysell');
//     }
//     /* Net holding of a particular coin in a particular company */

//     console.log("portfolio after update", portfolio);

//     const finalUser = await User.findOneAndUpdate({ _id: userId }, { portfolio });

//     console.log("User after update", finalUser);
//     res.redirect("/buysell");
// }));



module.exports = router;