
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Imager = require('imager');
var config = require('config');

var imagerConfig = require(config.root + '/config/imager.js');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
};

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
};

/**
 * Article Schema
 */

var ArticleSchema = new Schema({

  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},

  categorie: {type:String, default:'',trim:true},
  region: {type : String, default : '', trim : true},
  departement: {type : String, default : '', trim : true},
  cp: {type : String, default : '', trim : true},
  ville: {type : String, default : '', trim : true},
  datedebut: { type: Date},
  datefin: { type: Date },

  user: {type : Schema.ObjectId, ref : 'User'},

  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */

ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');
ArticleSchema.path('categorie').required(true, 'Categorie cannot be blank');
ArticleSchema.path('region').required(true, 'Region cannot be blank');
ArticleSchema.path('departement').required(true, 'Département cannot be blank');


ArticleSchema.virtual('expirationTime').get(function(){

    var diff = {};                         // Initialisation du retour
    var tmp = this.datefin - Date.now();

    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
  //il y a "+diff.day+" jours, "+diff.hour+" heures, "+diff.min+" minutes et "+diff.sec+" secondes"

});

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3');
  var files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err);
  }, 'article');

  next();
});

ArticleSchema.pre('validate', function(next) {
  aa  = new Date();
  console.log('==========', aa);
  console.log('-----------BEFORE ----------------------------');
  console.log('---------------------------------- debut = ', this.datedebut);
  console.log('---------------------------------- fin = ', this.datefin);
  this.datedebut = new Date(this.datedebut);
  this.datefin = new Date(this.datefin);

  console.log('---------------------- AFTER ----------------------------');
  console.log('---------------------------------- debut = ', this.datedebut );
  console.log('---------------------------------- fin = ', this.datefin);
  next();
});


ArticleSchema.pre('save', function(done) {
  console.log('---------------------------------- SAVE ----------------------------');
  console.log('---------------------------------- debut = ', this.datedebut);
  console.log('---------------------------------- fin = ', this.datefin);
  done();
});
/**
 * Methods
 */

ArticleSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3');
    var self = this;

    this.validate(function (err) {
      if (err) return cb(err);
      imager.upload(images, function (err, cdnUri, files) {
        if (err) return cb(err);
        if (files.length) {
          self.image = { cdnUri : cdnUri, files : files };
        }
        self.save(cb);
      }, 'article');
    });
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    var notify = require('../mailer');

    this.comments.push({
      body: comment.body,
      user: user._id
    });

    if (!this.user.email) this.user.email = 'email@product.com';
    notify.comment({
      article: this,
      currentUser: user,
      comment: comment.body
    });

    this.save(cb);
  },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  removeComment: function (commentId, cb) {
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) this.comments.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  }
}

/**
 * Statics
 */

ArticleSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', ' id name email username')
      .populate('comments.user')
      .exec(cb);
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};
    //console.info("GA ---------------------MODEL/ARTICLE criteria", criteria);

    this.find(criteria)
      .populate('user', 'id name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}

mongoose.model('Article', ArticleSchema);
