
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;


/**
 * Categorie Schema
 */

var CategoriesSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  faicon: {type : String, default : 'fa fa-tags', trim : true},
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */

CategoriesSchema.path('title').required(true, 'Categorie title cannot be blank');

/**
 * Methods
 */

CategoriesSchema.methods = {

  /**
   * Save categorie
   *
   * @param {Function} cb
   * @api private
   */

  Save: function (cb, err) {
    if (err) return cb(err);
    this.save(cb);
  }
}

/**
 * Statics
 */

CategoriesSchema.statics = {

  /**
   * Find Categorie by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (categorieId, cb) {
    console.info("GA -----------------------------------  MODELS / load in model/categorie");
    this.findOne({ _id : categorieId })
        .exec(cb);
  },

  /**
   * List Categorie
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
        .sort({'createdAt': -1}) // sort by date
        .exec(cb);
  }
}

mongoose.model('Categorie', CategoriesSchema);
