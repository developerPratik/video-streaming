var routes = require('express').Router()
var path = require('path')
var fs = require('fs')
var req = require('request')
var fileType = require('file-type');
var ss = require('socket.io-stream')

var db = require('./model');

var randomTextLength = 7

routes.get('/', function (request, response) {
    db.find({}, function (err, docs) {

        response.render('videos', { "videos": docs });
    });
});






/**
 * Add route to add links to the database   
 */
routes.get('/add', function (request, response) {


    response.sendFile(path.join(__dirname, 'public/add.html'));

});



/**
 * Videos route to list the videos in the server
 */

routes.get('/videos', function (request, response) {


    db.find({}, function (err, docs) {

        response.render('videos', { "videos": docs });
    })

})



routes.get('/videofiles', function (request, response) {




    db.find({}, function (err, docs) {

        response.json(docs);
    })

});



/**
 * post to add route to add to the server
 */
routes.post('/add', function (request, response) {

    let { url, title } = request.body;

    if (!url || !title) {
        return;
    }
    let video = req.get(url);
    video.once('data', function (chunk) {
        let format = fileType(chunk);
        let type = '';

        if (format) {
            type = format.ext === "webm" ? "vp8" : "avc";
        }
        else {
            type = "avc";
        }

        db.create({ url, title, type }, function (err, newDoc) {

            db.find({}, function (error, docs) {
                response.render('videos', { "videos": docs, "message": err || "Video has been added successfully" });
            });
        });
    });

});



routes.get('/random', function (request, response) {

    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


    let randomId = "";

    let i = 0;

    while (i++ < randomTextLength) {
        let character = characters.charAt(Math.random() * characters.length);
        randomId += character;
    }



    response.send(randomId);

});


// route for the video player

routes.get('/play', function (request, response) {

    db.findOne({ "_id": request.query.id }, function (err, doc) {

        let error = err || !doc ? true : null;
        response.render('play', { "error": error })
    });
});


module.exports = routes;