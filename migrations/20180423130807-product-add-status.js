'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.connection
    .connect(db.connectionString)
    .then(db => db.collection('products'))
    .then(products => products.updateMany({status: {$exists: false}}, {$set: {status: 'active'}}))
    .then(docs => {
      console.log('Migration up success');
      console.log(docs.result);
    })
    .catch(err => {
      console.log('Migration up error', err);
      return Promise.reject(err);
    });
};

exports.down = function(db) {
  return db.connection
    .connect(db.connectionString)
    .then(db => db.collection('products'))
    .then(products => products.updateMany({status: {$exists: true}}, {$unset: {status: ''}}))
    .then(docs => {
      console.log('Migration down success');
      console.log(docs.result);
    })
    .catch(err => {
      console.log('Migration down error', err);
      return Promise.reject(err);
    });
};

exports._meta = {
  version: 1
};
