const express = require('express');
const mongoose = require('mongoose');
const User = require('../schema/UserSchema');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const axios = require('axios');



router.get('/', isLoggedIn, async (req, res) => {
    console.log(req.user.id);
    let user = await User.findOne({ _id: req.user.id });
    console.log(user);
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

    let index = 0;
    let priceArr = [];
    for await (let element of holding) {
        // const baseURL = "https://api.coingecko.com/api/v3";
        // const response = await axios.get(`${baseURL}/simple/price`, {
        //     params: {
        //         ids: `${element.coinName}`,
        //         vs_currencies: 'INR'
        //     }
        // });
        // console.log(response.data[`${element.coinName}`][`inr`]);
        priceArr.push(100);
        let percentage= (-investment[index].initialInvestment + element.numberOfCoins * priceArr[index]) / investment[index].initialInvestment;
        profitloss.push(percentage*100);
        index = index + 1;
    }
    // console.log("hello world");
    let f = false;
    // console.log(holding);
    res.render('users/dashboard', { f:f,arr: holding, price: priceArr ,profitloss:profitloss,username:user.username});
});


router.get('/:id', isLoggedIn, async (req, res) => {
    
    const user = await User.findOne({ _id: req.user.id });
console.log(user);
    // console.log(user);
    let investment = user.portfolio[0].initialInvestmentAccordingToCoinAndCompany;
    let holding = user.portfolio[0].holdingAccordingToCoinAndCompany;

    const arr = holding.filter((element) => {
        return req.params.id === element.coinName;
    });
  let arr1 =investment.filter((element) => {
        return req.params.id === element.coinName;
    });
    const baseURL = "https://api.coingecko.com/api/v3";
    // const response = await axios.get(`${baseURL}/simple/price`, {
    //     params: {
    //         ids: `${req.params.id}`,
    //         vs_currencies: 'INR'
    //     }
    // });
    let price = 100;
    let profitloss=[];
    arr.forEach((element,index) =>
    {
        let percentage = (element.numberOfCoins * price - arr1[index].initialInvestment) / arr1[index].initialInvestment;
        profitloss.push(percentage*100);
    })
    let f=true;
    console.log(arr);
    res.render('users/dashboard', { f: f, arr: arr, priceVal: price, profitloss: profitloss, username: user.username  });
});




module.exports = router;