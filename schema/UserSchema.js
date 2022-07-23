const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');





/*
    Documentation : 

    x: price
    y: comp
    z: coinName
 
    y = y1
    x = x1
    z = z1
*/

const initialInvestmentAccordingToCoinSchema = new Schema({
    initialInvestment: {
        type: Number,
        required: true,
        default: true
    }, // += x1
    coinName: {
        type: String,
        required: true,
        unique: true
    }, // z (primary key)
});

const initialInvestmentAccordingToCoinAndCompanySchema = new Schema({
    initialInvestment: {
        type: Number,
        required: true,
        default: true
    }, // += x1
    coinName: {
        type: String,
        required: true,
        unique: true
    }, // z (primary key)
    companyName: {
        type: String,
        required: true,
        unique: true
    } // y1 (pk)
});

const holdingAccordingToCoinSchema = new Schema({
    numberOfCoins: {
        type: Number,
        required: true,
        default: true
    },  // += x1/api(z1's price)
    coinName: {
        type: String,
        required: true,
        unique: true
    }, // z (primary key)
});

const holdingAccordingToCoinAndCompanySchema = new Schema({
    numberOfCoins: {
        type: Number,
        required: true,
        default : true
    },  // += x1/api(z1's price)
    coinName: {
        type: String,
        required: true,
        unique: true
    }, // z (primary key)
    companyName: {
        type: String,
        required: true,
        unique: true
    } // y1 (pk)
});


const portfolioSchema = new Schema({
    initialInvestmentAccordingToCoin: [initialInvestmentAccordingToCoinSchema],
    initialInvestmentAccordingToCoinAndCompany: [initialInvestmentAccordingToCoinAndCompanySchema],
    holdingAccordingToCoin: [holdingAccordingToCoinSchema],
    holdingAccordingToCoinAndCompany: [holdingAccordingToCoinAndCompanySchema]

});

const UserSchema = new Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    portfolio: [portfolioSchema]

});

/*

    -> User1 : logged in

    -> portfolio : empty

    -> he bought x1 amount , in y1 company, of z1 coin


    router.post('/' , isAdmin , async(req , res)=>{
        const userId = req.user;
        const {x , y , z} = req.body;

        const user = await User.findById({userId});

        const portolio = user.portfolio;

        const initialInvestmentAccordingToCoin = portfolio[0]; // array
        for(int i = 0 ; i < n ; i++){
            if(initialInvestmentAccordingToCoin[i].coinName === z){
                initialInvestmentAccordingToCoin[i].initialInvestment += x;
            }
        }
        portfolio[0] = initialInvestmentAccordingToCoin;



        const initialInvestmentAccordingToCoinAndCompany = portfolio[1]; // array
        for(int i = 0 ; i < n ; i++){
            if(initialInvestmentAccordingToCoinAndCompany[i].coinName === z && initialInvestmentAccordingToCoinAndCompany[i].companyName === y){
                initialInvestmentAccordingToCoinAndCompany[i].initialInvestment += x;
            }
        }
        portfolio[1] = initialInvestmentAccordingToCoinAndCompany;



        const response = await axios("/" , {});
        const price = response.coin.price;



        const holdingAccordingToCoin = portfolio[2]; // array
        for(int i = 0 ; i < n ; i++){
            if(holdingAccordingToCoin[i].coinName === z){
                holdingAccordingToCoin[i].numberOfCoins += x/price;
            }
        }
        portfolio[2] = holdingAccordingToCoin;

        const holdingAccordingToCoinAndCompany = portfolio[3]; // array
        for(int i = 0 ; i < n ; i++){
            if(holdingAccordingToCoinAndCompany[i].coinName === z && holdingAccordingToCoinAndCompany[i].companyName === y){
                holdingAccordingToCoinAndCompany[i].numberOfCoins += x/price;
            }
        }
        portfolio[3] = holdingAccordingToCoinAndCompany;


        User.findByIdAndUpdate(userId , {$set : {portfolio}});

        res.status(200).json({message : data updated});
    });




*/












UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);