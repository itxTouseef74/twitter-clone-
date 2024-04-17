const user = require("../models/user.js");

exports.login = (req, res) => {
  console.log(req.body);

  user.findOne(
    {
      $and: [
        {
          $or: [
            { mail: req.body.usernameOrEmail },
            { username: req.body.usernameOrEmail },
          ],
        },
        { password: req.body.password },
      ],
    },
    (err, user) => {
      if (err) throw err;

      console.log(`found user: ${user}`);
      res.send({ foundUser: user });
    }
  );
};

exports.register = (req, res) => {
  console.log(req.body);
  user.countDocuments({ username: req.body.username }, (err, count) => {
    if (err) throw err;

    if (count === 0) {
      user
        .create({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
        })
        .then((newUser) => {
          console.log(`newUser from met: ${newUser}`);
          res.send(newUser);
        })
        .catch((e) => {
          throw e;
        });
    } else {
      res.send(false);
    }
  });
};

exports.getuserwithoutdetail = (req, res) => {
  console.log(req.body);
  user.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;

    res.send(user);
  });
};

exports.getuserwithdetails = (req, res) => {
  user
    .findOne({ username: req.body.username })
    .populate({
      path: "tweets",
      options: {
        sort: { createdDate: -1 },
      },
      populate: [
        {
          path: "author",
          model: "user",
        },
        {
          path: "parent",
          model: "tweet",
          populate: {
            path: "author",
            model: "user",
          },
        },
      ],
    })
    // .populate('likedTweets')
    .exec()
    .then((user) => {
      console.log(user);
      res.send(user);
      console.log("the work");
    });
};

exports.updateuser = (req , res) =>{
    user.update({ _id: req.body.userId }, {$set:req.body.newInfos}, (err, result) => {
        if (err) throw err;

        console.log(result)

        res.send(result)
    });
}