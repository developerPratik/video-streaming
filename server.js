
let express = require('express');
let path = require('path');
let fs = require('fs');

let exphbs = require('express-handlebars');

let app = express();

let routes = require('./routes');

let bodyParser = require('body-parser');

let request = require('request');

let Transcoder = require('stream-transcoder');

var fileType = require('file-type');

let mongoose = require('mongoose');

let {db_url} = require('./config');

mongoose.connect(db_url);

mongoose.Promise = global.Promise;

let {connection} = mongoose;

let db = require('./model');




let ss = require('socket.io-stream');

let server = require('http').Server(app);

let io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'assets')));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'public/index.html'));

// });


app.engine('.hbs', exphbs({ extname: '.hbs' }));         // handlebars as default engine
app.set('views', __dirname + '/public');
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


io.of('/video').on('connection', function (client) {


    client.on('id', function (id) {
        let stream = ss.createStream();
        db.findOne({ "_id": id }, function (err, doc) {
            if (err) {
                response.json({
                    error: 500
                })
                return;
            }
            if (doc) {

                let url = doc.url;
                
                ss(client).emit('video', stream);
                let video = request.get(url);
                /**
                 * The video chunks is streamed to the socket.io stream object and the stream object is sent to the client 
                 * The client stream object listens to the stream for data events and then appends the data to its sourceBuffer from MediaSource class
                 * 
                 */
                 video.pipe(stream);
            }
            else {
                client.emit('video_not_found');
            }

        });
    });

});

app.get('/watch', function(request, response){
    
    let id = request.query.v;


    db.findOne({ "_id": id }, function (err, doc) {
        if(err){

            return;
        }


        response.json(doc);

    })

});


app.use('/', function (request, response, next) {

    request.io = io;
    next();
}, routes);


let port = process.env.PORT || 9247

connection.on('connection', console.error.bind(console, 'Mongo db connected'));

connection.on('error', console.error.bind(console, "error"));
server.listen(port, function () {

    console.log('listening on ' + port);
});






