/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {

  var criteria = { user: req.params.user };
  var perPage = 500;
  var page = (req.params.page > 0 ? req.params.page : 1) - 1;
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    Article.count(criteria).exec(function (err, count) {
      console.info("GA -------------ANNONCEUR-------- criteria", criteria, "count - " , count, articles.user);
      res.render('articles/list', {
        icon: 'fa fa-map-marker',
        title: 'Tous les Bons plans de l\'annonceur ' ,
        param: req.params.user,
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
