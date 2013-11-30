/* 
    util.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
		This file is part of mongodb-rest.
*/ 
var mongo = require("mongodb"),
    config = module.parent.parent.exports.config;

/*
 * flavorize - Changes JSON based on flavor in configuration 
 */
module.exports.flavorize = function(doc, direction) {
  if (direction == "in") {
    switch (config.flavor) {
      case "sproutcore":
        delete doc['guid']; // only do this in case flavor is set to sproutcore
        break;
      case "nounderscore":
        delete doc['id']; // only do this in case flavor is set to sproutcore
        break;
      default: 
        break;
    }
  } else {
    switch (config.flavor) {
      case "sproutcore":
        var guid = docIdString(doc._id);
        delete doc['_id'];
        doc.guid = guid;
        break;
      case "nounderscore":
        var id = docIdString(doc._id);
        delete doc['_id'];
        doc.id = id;
        break;
      default:
        doc._id = docIdString(doc._id);
        break;
    }
  }
  return doc;
};

/**
 * Return document id in oid-hexString or plain-string format 
 */
function docIdString(_id) {
  var strOrHexString;
  try {
    /*TODO: should this be _id.str; nowadays? */
    strOrHexString = _id.toHexString();
  } catch(err) {
    strOrHexString = _id;/*fall back to string*/
  }
  return strOrHexString;
}
