/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { region: req.params.region };
  var perPage = 5;
  var page = (req.params.page > 0 ? req.params.page : 1) - 1;
  console.log("--page = ", page, "-- criteria = ", criteria);
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    Article.count(criteria).exec(function (err, count) {
      console.log("criteria", criteria, "count - " , count);
      res.render('articles/list', {
        icon: 'fa fa-map-marker',
        title: 'Bons plans pour la région ' ,
        param: req.params.region,
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
