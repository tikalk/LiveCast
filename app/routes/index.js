/*
 * GET home page.
 */

exports.index = function (req, res) {
    req.session.foo = req.session.foo || 'bar';
    res.render('index', { title: 'LiveCast' });
};