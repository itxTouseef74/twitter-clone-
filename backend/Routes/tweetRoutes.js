const express =  require ('express')
const router  =  express.Router()
const tweetController =  require('../Controllers/tweetController.js')


router.post('/getthetweet' , tweetController.getthetweet)
router.post('/getbookmarks' , tweetController.getbookmarks)
router.post('/likeorunlike' , tweetController.likeorunlike)
router.post('/addorremovefrombookmarks' , tweetController.addorremovefrombookmarks)
router.post('/removetweet' , tweetController.removetweet)
router.post('/followorunfollow' , tweetController.followorunfollow)
router.post('/gettweetpage' , tweetController.gettweetpage)
router.post('/addreply' , tweetController.addreply)
router.post('/newtweet' , tweetController.newtweet)

module.exports = router