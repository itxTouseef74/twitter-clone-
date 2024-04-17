const user = require("../models/user.js");
const tweet = require("../models/tweet.js")

exports.allUsers = (req , res) =>{
    user.find({})
        .populate('following')
        .populate('followers')
        .exec((err,users) => {
            if(err){console.log(err)}
            res.send(users)
        })
}

exports.allTweets = (req , res) =>{
    tweet.find({},(err,tweets) => {
        if(err){console.log(err)}
        res.send(tweets)
    })
}

exports.operation = (req , res ) => {
    res.send("operation succesfully")
}