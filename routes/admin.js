const express = require('express');
const router = express.Router();
const { loggedIn, isAdmin } = require('./authmiddlewares');

router.get('/', isAdmin, (req, res, next) => {
    try {
        return res.render('admin', { title: 'Admin Interface', username: req.user?.username, role: req.user?.role || 'user' })
    } catch (err) {
        next(err)
    }
})

module.exports = router;