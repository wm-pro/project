const express = require('express')
const router = express.Router()
const ctrl = require('./controller.js')
router.get('/', (req, res) => {
    res.render('index.ejs', { user: req.session.user, islogin: req.session.islogin })
})
router.get('/register', ctrl.registerPage)
router.get('/login', ctrl.loginPage)
    // 注册用户接口'
router.post('/register', ctrl.register)
    // 登录接口
router.post('/login', ctrl.login)
    // 注销接口
router.get('/logout', ctrl.logout)
router.get('/article/add', ctrl.articleAddPage)
router.post('/article/add', ctrl.articleAdd)
router.get('/article/info/:id', ctrl.showArticleDetail)
router.get('/article/edit/:id', ctrl.showEditArticle)
router.post('/article/edit', ctrl.editArticle)
module.exports = router