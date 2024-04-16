const app = require('express')()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const user = require('./models/user')
const tweet = require('./models/tweet')

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost/twitter-trial'


mongoose.connect(MONGODB_URI, {
    // useFindAndModify: false,
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
},() => {
    console.log(`database connected`)
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Real app ===>

app.post('/api/login',(req,res) => {
    console.log('geldii')
    console.log(req.body)

    user.findOne({
        $and:[
            {$or:[
                    {mail:req.body.usernameOrEmail},{username:req.body.usernameOrEmail}
                ]},
            {password:req.body.password}
        ]
    },(err,user) => {
        if(err) throw err

        console.log(`found user: ${user}`)
        res.send({foundUser:user})
    })
})


app.post('/api/register',(req,res) => {
    console.log(req.body)
    user
        .countDocuments({username:req.body.username},(err,count) => {
            if(err) throw err

            if(count === 0){
                user.create({
                    name:req.body.name,
                    username:req.body.username,
                    password:req.body.password,
                }).then(newUser => {
                    console.log(`newUser from met: ${newUser}`)
                    res.send(newUser)
                })
                    .catch(e => {throw e})
            }
            else{
                res.send(false)
            }
        })
})


app.post('/api/getuserwithoutdetail',(req,res) => {
    console.log(req.body)
    user
        .findOne({username:req.body.username},(err,user) => {
            if(err) throw err

            res.send(user)
        })
})


app.post('/api/getuserwithdetails',(req,res) => {
    user
        .findOne({username:req.body.username})
        .populate({
            path:'tweets',
            options:{
                sort:{createdDate: -1}
            },
            populate:[
                {
                    path:'author',
                    model:'user',
                },
                {
                    path:'parent',
                    model:'tweet',
                    populate:{
                        path:'author',
                        model:'user'
                    }
                }
            ]
        })
        // .populate('likedTweets')
        .exec()
        .then((user) => {
            console.log(user)
            res.send(user)
            console.log("the work")
        })
})

app.post('/api/getthetweet',(req,res) => {
    tweet
        .findOne({_id:req.body.tweetId})
        .populate('author')
        .populate({
            path:"replies",
            populate:[
                {
                    path:'author',
                    model:'user'
                },
                {
                    path:'parent',
                    model:'tweet',
                    populate:{
                        path:'author',
                        model:'user'
                    }
                }
            ]
        })
        .populate({
            path:'parent',
            populate:{
                path:'author',
                model:'user'
            }
        })
        .exec((err,tweet) => {
            if(err) throw err

            console.log(tweet)
            res.send(tweet)
        })
})


app.post('/api/updateuser',(req,res) => {
    console.log(req.body)
    user.update({ _id: req.body.userId }, {$set:req.body.newInfos}, (err, result) => {
        if (err) throw err;

        console.log(result)

        res.send(result)
    });
})

app.get('/',(req,res) => {
    res.send("Avaiable paths:\n/allUsers\n/allTweets")
})


app.get('/allUsers',(req,res) => {
    user.find({})
        .populate('following')
        .populate('followers')
        .exec((err,users) => {
            if(err){console.log(err)}
            res.send(users)
        })
})

app.get('/allTweets',(req,res) => {
    tweet.find({},(err,tweets) => {
        if(err){console.log(err)}
        res.send(tweets)
    })
})


app.get('/operation',(req,res) => {
    res.send("operation succesfully")

})




app.listen(PORT,() => {
    console.log('server running: ' + PORT)
})





