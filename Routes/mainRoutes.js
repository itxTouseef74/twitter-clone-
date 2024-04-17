const express =  require ('express')
const router  =  express.Router()

const mainController =  require ('../Controllers/mainController.js')

router.get ('/allTweets' , mainController.allTweets)
router.get ('/allUsers' , mainController.allUsers)
router.get ('/operation' , mainController.operation)

module.exports =router