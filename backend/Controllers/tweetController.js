const tweet = require('../models/tweet.js')
const user =  require('../models/user.js')
exports.getthetweet = ( req ,res ) => {

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
}


exports.newtweet = async (req ,res ) =>{

    await tweet
    .create(req.body.tweetContent)
    .then(async (newTweet) => {
        await user
            .findOne({username:req.body.username},async (err,currentUser) => {
                if(err){console.log(err)}

                await currentUser.tweets.push(newTweet._id)
                await currentUser.save()

                await tweet
                    .findOne({_id:newTweet._id})
                    .populate('author')
                    .exec(async (err,result) => { 
                        if(err) throw err
                        await console.log(result)
                        await res.send(result)
                    })
            })
    })
    .catch(e => {throw e})
}

exports.addreply = async (req , res) =>{


    await tweet
    .create(req.body.tweetContent)
    .then(async (newTweet) => {
        tweet
            .findById(newTweet.parent)
            .exec((err,t) => {
                if(err) throw err

                t.replies.push(newTweet._id)
                t.save()
            })
        await user
            .findOne({username:req.body.username},async (err,currentUser) => {
                if(err){console.log(err)}

                await currentUser.tweets.push(newTweet._id)
                await currentUser.save()

                await tweet
                    .findOne({_id:newTweet._id})
                    .populate('author')
                    .exec(async (err,result) => {
                        if(err) throw err
                        await console.log(result)
                        await res.send(result)
                    })
            })
    })
    .catch(e => {throw e})
}

exports.gettweetpage = (req ,  res ) =>{


    // res.send('succes')
    var page = Number(req.body.page)
    var s = (page - 1) * Number(req.body.tweetPerPage)
    var l = Number(req.body.tweetPerPage)
    tweet
        .find({})
        // .skip(s)
        // .limit(l)
        .sort({createdDate: -1})
        .populate({
            path:'author',
        })
        .exec((err,tweets) => {
            if(err) throw err

            console.log(tweets)
            res.send(tweets)
            console.log(s,l)
            console.log(req.body)
        })
}

exports.followorunfollow=(req , res) =>{

    var currentUserId = req.body.currentUserId
    var userIdToFollow = req.body.userIdToFollow
    var follow = req.body.follow

    console.log(currentUserId,userIdToFollow,follow)

    user
        .findById(currentUserId)
        .exec((error,currentUser) => {
            if(error){console.log(error)}

            console.log(`current user : ${currentUser}`)
            if(follow){
                currentUser.following.push(userIdToFollow)
                currentUser.save()
            }
            else{
                currentUser.following.splice(currentUser.following.indexOf(userIdToFollow),1)
                currentUser.save()
            }
            user
                .findById(userIdToFollow)
                .exec((error,userToFollow) => {
                    if(error){console.log(error)}

                    console.log(`user to follow: ${userToFollow}`)

                    if(follow){
                        userToFollow.followers.push(currentUserId)
                        userToFollow.save()
                    }
                    else{
                        userToFollow.followers.splice(userToFollow.followers.indexOf(currentUserId),1)
                        userToFollow.save()
                    }
                })
        })

    res.send('success')
}


exports.removetweet = async(req ,res ) => {

    var tweetId = req.body.tweetId

    await tweet
        .findById(tweetId,(err,t) => {
            if(t.parent) {
                tweet
                    .findById(t.parent, async (err, parentTweet) => {
                        await parentTweet.replies.splice(parentTweet.replies.indexOf(tweetId), 1)
                        parentTweet.save()
                    })
            }
        })


    tweet
        .findOneAndDelete({_id:tweetId},(err,removed) => {
            if(err) throw err

            console.log(`document have been removed: ${removed}`)
        })

}

exports.likeorunlike = (req ,res ) => {
        const { currentUserId, tweetId, like } = req.body;
    
        user.findById(currentUserId, (err, currentUser) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
    
            if (!currentUser) {
                return res.status(404).send('User not found');
            }
    
            if (like) {
                currentUser.likedTweets.push(tweetId);
            } else {
                const index = currentUser.likedTweets.indexOf(tweetId);
                if (index !== -1) {
                    currentUser.likedTweets.splice(index, 1);
                }
            }
    
            currentUser.save()
                .then(() => {
                    tweet.findById(tweetId, (err, tweet) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Internal Server Error');
                        }
    
                        if (!tweet) {
                            return res.status(404).send('Tweet not found');
                        }
    
                        if (like) {
                            tweet.likedUsers.push(currentUserId);
                        } else {
                            const index = tweet.likedUsers.indexOf(currentUserId);
                            if (index !== -1) {
                                tweet.likedUsers.splice(index, 1);
                            }
                        }
    
                        tweet.save()
                            .then(() => {
                                return res.status(200).send('Operation successful');
                            })
                            .catch(err => {
                                console.log(err);
                                return res.status(500).send('Internal Server Error');
                            });
                    });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send('Internal Server Error');
                });
        });
}

exports.addorremovefrombookmarks = (req ,res ) =>{

    
    user
        .findOne({username:req.body.username},(err,u) => {
            if(err) throw err

            if(req.body.add){
                u.bookmarks.unshift(req.body.tweetId)
                u.save()
                res.send("adding to bookmark: success")
            }
            else{
                u.bookmarks.splice(u.bookmarks.indexOf(req.body.tweetId),1)
                u.save()
                res.send("remove from bookmark: success")
            }
        })
}


exports.getbookmarks = (req , res) =>{
    user
    .findOne({username:req.body.username})
    .populate({
        path: 'bookmarks',
        populate:[
            {
                path: 'author',
                model: 'user'
            },
            {
                path: 'parent',
                model: 'tweet',
                populate:{
                    path: 'author',
                    model: 'user'
                }
            }
        ]
    })
    .exec((err,u) => {
        if(err) throw err
        res.send(u.bookmarks)
    })
}