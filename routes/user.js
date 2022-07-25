const express = require('express');
const mongoose = require('mongoose');
const User = require('../schema/UserSchema');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const axios = require('axios');
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');



router.get('/profile', isLoggedIn, catchAsync(async (req, res) => {
    const user=await User.findById(req.user.id);
    res.render('users/editprofile',{user: user});
}))
router.post('/profile', isLoggedIn, catchAsync( async (req, res) => {
    const { username, email, name } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { username: username, email: email, name: name },{new:true});
    
    res.redirect('/portfolio');
}))

router.get("/chart/pie", isLoggedIn, async (req, res) => {
    console.log("Hello world");
    const user = await User.findOne({ _id: req.user.id });
    const arr = user.portfolio[0].holdingAccordingToCoin;

    let data = [];
    for await (let element of arr) {
        const baseURL = "https://api.coingecko.com/api/v3";
        const response = await axios.get(`${baseURL}/simple/price`, {
            params: {
                ids: `${element.coinName}`,
                vs_currencies: 'INR'
            }
        });

        const obj = {
            name: element.coinName,
            currentPrice: response.data[`${element.coinName}`][`inr`] * element.numberOfCoins
        }
        data.push(obj);
    }

    // console.log(arr);
    console.log(data);
    data = JSON.stringify(data);
    res.send(data);
});
router.get("/chart/pie/:id", isLoggedIn, async (req, res) => {
    console.log("Hello world");
    const user = await User.findOne({ _id: req.user.id });
    const arr = user.portfolio[0].holdingAccordingToCoinAndCompany;

    let data = [];
    for await (let element of arr) {
        if(element.coinName===req.params.id)
        {
        const baseURL = "https://api.coingecko.com/api/v3";
        const response = await axios.get(`${baseURL}/simple/price`, {
            params: {
                ids: `${element.coinName}`,
                vs_currencies: 'INR'
            }
        });

        const obj = {
            name: element.companyName,
            currentPrice: response.data[`${element.coinName}`][`inr`] * element.numberOfCoins
        }
        data.push(obj);
        }
    }

    // console.log(arr);
    console.log(data);
    data = JSON.stringify(data);
    res.send(data);
});


router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    console.log(req.user.id);
    const user = await User.findOne({ _id: req.user.id });
    console.log(user);
    if(user.portfolio.length===0)
    {
        return res.render('users/addfunds', { username: user.name });
    }
    let investment = user.portfolio[0].initialInvestmentAccordingToCoin;
    // console.log(user);
    let holding = user.portfolio[0].holdingAccordingToCoin;
    console.log(holding);
    let profitloss=[];
    // holding.forEach(async (element) => {
    //     const baseURL = "https://api.coingecko.com/api/v3";
    //     const response = await axios.get(`${baseURL}/simple/price`, {
    //         params: {
    //             ids: `${element.coinName}`,
    //             vs_currencies: 'INR'
    //         }
    //     });
    //     // console.log(response.data[`${element.coinName}`][`inr`]);
    //     element.price = response.data[`${element.coinName}`][`inr`];
    //     console.log(element.price);
    // });
    let sum=0;
    let netrevenue=0;
    let index = 0;
    let size=holding.length;
    let priceArr = [];
    for await (let element of holding) {
        const baseURL = "https://api.coingecko.com/api/v3";
        const response = await axios.get(`${baseURL}/simple/price`, {
            params: {
                ids: `${element.coinName}`,
                vs_currencies: 'INR'
            }
        });
        // console.log(response.data[`${element.coinName}`][`inr`]);
        priceArr.push(response.data[`${element.coinName}`][`inr`]);
        sum += investment[index].initialInvestment;
        let percentage= (-investment[index].initialInvestment + element.numberOfCoins * priceArr[index]) / investment[index].initialInvestment;
        profitloss.push(percentage*100);
        netrevenue += (-investment[index].initialInvestment + element.numberOfCoins * priceArr[index]) ;
        index = index + 1;
    }
    console.log(netrevenue,'OK');
    // console.log("hello world");
    let f = false;
    // console.log(holding);
    res.render('users/dashboard', { f:f,arr: holding, price: priceArr ,profitloss:profitloss,username:user.name,sum:sum,netrevenue:netrevenue,size:size});
}));




router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    
    const user = await User.findOne({ _id: req.user.id });
console.log(user);
    // console.log(user);
    let sum=0;
    let netrevenue=0;
    let size=0;
    let investment = user.portfolio[0].initialInvestmentAccordingToCoinAndCompany;
    let holding = user.portfolio[0].holdingAccordingToCoinAndCompany;

    const arr = holding.filter((element) => {
        return req.params.id === element.coinName;
    });
  let arr1 =investment.filter((element) => {
        return req.params.id === element.coinName;
    });
    const baseURL = "https://api.coingecko.com/api/v3";
    const response = await axios.get(`${baseURL}/simple/price`, {
        params: {
            ids: `${req.params.id}`,
            vs_currencies: 'INR'
        }
    });
    size=arr1.length;
    let price = response.data[`${req.params.id}`][`inr`];
    let profitloss=[];
    arr.forEach((element,index) =>
    {
        sum+=arr1[index].initialInvestment;
        netrevenue += (element.numberOfCoins * price - arr1[index].initialInvestment) ;
        let percentage = (element.numberOfCoins * price - arr1[index].initialInvestment) / arr1[index].initialInvestment;
        profitloss.push(percentage*100);
    })
    let f=true;
    console.log(arr);
    res.render('users/dashboard', { f: f, arr: arr, priceVal: price, profitloss: profitloss, username: user.name, sum: sum, netrevenue: netrevenue, size: size  });
}));




module.exports = router;