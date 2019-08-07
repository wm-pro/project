const conn = require('./db.js')
const moment = require('moment')
const marked = require('marked')
module.exports = {
    registerPage: (req, res) => {
        res.render('./user/register.ejs', {})
    },
    loginPage: (req, res) => {
        res.render('./user/login.ejs', {})
    },
    register: (req, res) => {
        const data = req.body
        const dt = new Date()
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1).toString().padStart(2, '0')
        const d = dt.getDay().toString().padStart(2, '0')
        const hh = dt.getHours().toString().padStart(2, '0')
        const mm = dt.getMinutes().toString().padStart(2, '0')
        const ss = dt.getSeconds().toString().padStart(2, '0')
        data.ctime = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        const sql = 'insert into blog_users set ?'
        const sql1 = 'SELECT COUNT(id) as count FROM blog_users WHERE username=?'
        conn.query(sql1, data.username, (err, result) => {
            if (result[0].count >= 1) {
                return res.send({ status: 501, msg: '用户名已存在', data: null })
            }
            conn.query(sql, data, (err, result) => {
                if (err) {
                    return res.send({ status: 500, msg: err.message, data: null })
                }
                res.send({ status: 200, msg: 'ok', data: null })
            })
        })
    },
    login: (req, res) => {
        const body = req.body
        const sql = 'SELECT * FROM blog_users WHERE username=? AND `password`=?'
        conn.query(sql, [body.username, body.password], (err, result) => {
            if (result.length == 0) {
                return res.send({ status: 500, msg: '用户名或密码错误' })
            }
            req.session.user = result[0]
            req.session.islogin = true
            res.send({ status: 200, msg: '登录成功', data: result })
        })

    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },
    articleAddPage: (req, res) => {
        if (!req.session.islogin) {
            return res.redirect('/')
        }
        res.render('./article/add.ejs', {
            user: req.session.user,
            islogin: req.session.islogin
        })
    },
    articleAdd: (req, res) => {
        const body = req.body
            // body.authorId = req.session.user.id
        body.ctime = moment().format('YY-MM-DD HH:mm:ss')
            // console.log(body);
        const sql = 'insert into blog_articles set ?'
        conn.query(sql, body, (err, result) => {
            if (err) {
                return res.send({ status: 500, msg: '添加文章失败', data: null })
            }
            res.send({ status: 200, msg: 'ok', insertId: result.insertId })
        })

    },
    showArticleDetail: (req, res) => {
        const id = req.params.id
        const sql = 'select * from blog_articles where id=?'
        conn.query(sql, id, (err, result) => {
            if (err) {
                return res.send({ status: 500, msg: '获取文章失败' })
            }
            const html = marked(result[0].content)
            result[0].content = html
            res.render('./article/Info.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
        })

    },
    showEditArticle: (req, res) => {
        if (!req.session.islogin) {
            return res.redirect('/')
        }
        const id = req.params.id
        const sql = 'select * from blog_articles where id=?'
        conn.query(sql, id, (err, result) => {
            if (err) {
                return res.send({ status: 500, msg: err.message })
            }
            res.render('./article/edit.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
        })
    },
    editArticle: (req, res) => {
        const body = req.body
        const id = body.id
        const sql = 'update blog_articles set ? where id=?'
        conn.query(sql, [body, id], (err, result) => {
            if (err) {
                return res.send({ status: 500, msg: '编辑文章失败' })
            }
            res.send({ status: 200, msg: '编辑文章成功' })
        })
    }
}