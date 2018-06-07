'use strict';
var Datastore = require('nedb');
var db = {
    'videos' : new Datastore({
        filename: './db/videos.db', autoload: true
    })
}

module.exports = function(){
    return db;
}