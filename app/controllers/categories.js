
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Categorie = mongoose.model('Categorie')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){

  Categorie.load(id, function (err, categorie) {
    if (err) return next(err);
    if (!categorie) return next(new Error('not found'));
    req.categorie = categorie;
    next();
  });
};

/**
 * List
 */

exports.index = function (req, res){
  //var criteria = { user: req.user.n };
  var options = {};

  Categorie.list( options, function (err, categories) {
    if (err) return res.render('500');
    console.info("GA ----------------------------------- controller/categorie --> index ");

    Categorie.count().exec(function (err, count) {
      console.info("GA ----------------------------------- count - " , count);

      res.render('categories/index', {
        icon: 'fa fa-tags',
        title: 'Mes Categories',
        categories: categories
      });
    });
  });
};

/**
 * New Categorie
 */

exports.new = function (req, res){
  res.render('categories/new', {
    title: 'Nouvelle categorie',
    categorie: new Categorie({})
  });
};

/**
 * Create a Categorie
 */

exports.create = function (req, res) {
  var categorie = new Categorie(req.body);

  categorie.Save( function (err) {
    if(err) console.log(err);
    if (!err) {
      req.flash('success', 'Successfully created categorie!');
      return res.redirect('/categories/'+categorie._id);
    }
    res.render('categories/new', {
      title: 'Nouvelle Categorie',
      categorie: categorie,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an Categorie
 */

exports.edit = function (req, res) {
  res.render('categories/edit', {
    title: 'Edit ' + req.categorie.title,
    categorie: req.categorie
  });
};

/**
 * Update Categorie
 */

exports.update = function (req, res){
  console.info("GA -----------------------------------  CONTROLLER / Update categorie");
  var categorie = req.categorie;

  // make sure no one changes the user
  delete req.body.user;
  categorie = extend(categorie, req.body);

  categorie.Save( function (err) {
    if (!err) {
      return res.redirect('/categories/' + categorie._id);
    }

    res.render('articles/edit', {
      title: 'Edit categorie',
      categorie: categorie,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('categories/show', {
    title: req.categorie.title,
    categorie: req.categorie
  });
};

/**
 * Delete a Categorie
 */

exports.destroy = function (req, res){
  var categorie = req.categorie;
  categorie.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('categories/index');
  });
};
